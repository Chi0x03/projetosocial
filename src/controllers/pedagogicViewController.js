// src/controllers/pedagogicViewController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getPedagogicView = async (req, res) => {
  try {
    const respostasDeProvas = await prisma.respostasDeProvas.findMany({
      where: { provaId: parseInt(req.params.id) },
      include: {
        questao: true,
      },
    });

    const questoesSet = new Set();
    const alunosMap = new Map();

    // Função de hash para gerar um valor único
    function hash(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash * 31 + str.charCodeAt(i)) | 0;
      }
      return hash.toString(16);
    }

    // console.log(respostasDeProvas);

    respostasDeProvas.forEach((resposta) => {
      questoesSet.add(resposta.questao.id);

      const alunoHash = hash(resposta.aluno);

      if (!alunosMap.has(alunoHash)) {
        alunosMap.set(alunoHash, {
          nome: resposta.aluno,
          totalAcertos: 0,
          respostas: [],
        });
      }

      const alunoData = alunosMap.get(alunoHash);
      const respostaExistente = alunoData.respostas.find((r) => r.questao === resposta.questao.id);
      if (!respostaExistente) {
        alunoData.respostas.push({
          questao: resposta.questao.id,
          itemMarcado: resposta.itemMarcado,
          acertou: resposta.acertou,
        });
        if (resposta.acertou) {
          alunoData.totalAcertos++;
        }
      }

    });

    const totalQuestoes = questoesSet.size;
    const alunos = Array.from(alunosMap.values()).map((alunoData) => {
      alunoData.percentualAcertos = `${((alunoData.totalAcertos / totalQuestoes) * 100).toFixed(2)}%`;
      return alunoData;
    });

    res.json({ questoes: Array.from(questoesSet), alunos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter vista pedagógica' });
  }
};

// Adicionar resposta e atualizar ranking
const addAnswer = async (req, res) => {
  try {
    const { tempoDeResposta, totalAcertos, nomeAluno, respostas } = req.body;
    const provaId = parseInt(req.params.id);
    const respostasDeProvas = await prisma.respostasDeProvas.createMany({
      data: respostas
    });

    const ranking = await prisma.ranking.create({
      data: {
        nomeAluno,
        totalAcertos,
        tempoDeResposta,
        provaId
      }
    });

    res.json('respostasDeProvas criadas com sucesso');

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao adicionar resposta' });
  }
};

const getRanking = async (req, res) => {
  try {
    const provaId = parseInt(req.params.id);

    const count = await prisma.prova.findUnique({
      where: { id: provaId },
      include: {
        _count: {
          select: {
            questoes: true
          }
        }
      }
    });

    const ranking = await prisma.ranking.findMany({
      where: { provaId },
      orderBy: [
        {
          totalAcertos: 'desc'
        },
        {
          tempoDeResposta: 'asc'
        }
      ],
      select: {
        nomeAluno: true,
        totalAcertos: true,
        tempoDeResposta: true,
        provaId: true,
      }
    });

    const rankingComTotalQuestoes = ranking.map((item) => ({
      ...item,
      totalQuestoes: count._count.questoes,
      acertos: item.acertos
    }));

    // Envia a resposta com os dados do ranking
    res.json(rankingComTotalQuestoes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter ranking' });
  }
};


module.exports = {
  getPedagogicView,
  addAnswer,
  getRanking
};

