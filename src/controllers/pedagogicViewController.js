// src/controllers/pedagogicViewController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

const getPedagogicView = async (req, res) => {
  try {
    const respostasDeProvas = await prisma.respostasDeProvas.findMany({
      where: { provaId: parseInt(req.params.id) },
      include: {
        questao: {
          include: {
            descritor: true,
          },
        },
      },
    });

    const questoesSet = new Set();
    const alunosMap = new Map();
    const descritoresStats = new Map();

    // Função de hash para gerar um valor único
    function hash(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash * 31 + str.charCodeAt(i)) | 0;
      }
      return hash.toString(16);
    }

    respostasDeProvas.forEach((resposta) => {
      questoesSet.add(resposta.questao.id);
      const alunoHash = hash(resposta.aluno);

      // Inicializa os dados do aluno se ainda não estiverem no Map
      if (!alunosMap.has(alunoHash)) {
        alunosMap.set(alunoHash, {
          nome: resposta.aluno,
          totalAcertos: 0,
          respostas: [],
          questoesRespondidas: new Set(),  // Set para evitar questões duplicadas
        });
      }

      const alunoData = alunosMap.get(alunoHash);

      // Verifica se a questão já foi respondida pelo aluno
      if (!alunoData.questoesRespondidas.has(resposta.questao.id)) {
        alunoData.questoesRespondidas.add(resposta.questao.id);

        // Adiciona a resposta do aluno
        alunoData.respostas.push({
          questao: resposta.questao.id,
          itemMarcado: resposta.itemMarcado,
          acertou: resposta.acertou,
        });

        // Incrementa o total de acertos, se aplicável
        if (resposta.acertou) {
          alunoData.totalAcertos++;
        }
      }

      // Processa os dados dos descritores
      if (resposta.questao.descritor) {
        const descritorId = resposta.questao.descritor.id;
        if (!descritoresStats.has(descritorId)) {
          descritoresStats.set(descritorId, {
            codigo: resposta.questao.descritor.codigo,
            descricao: resposta.questao.descritor.descricao,
            totalQuestoes: 0,
            totalAcertos: 0,
          });
        }

        const descritorData = descritoresStats.get(descritorId);
        descritorData.totalQuestoes++;
        if (resposta.acertou) {
          descritorData.totalAcertos++;
        }
      }
    });

    const totalQuestoes = questoesSet.size;

    // Processa os dados dos alunos e calcula o percentual de acertos
    const alunos = Array.from(alunosMap.values()).map((alunoData) => ({
      nome: alunoData.nome,
      totalAcertos: alunoData.totalAcertos,
      percentualAcertos: `${((alunoData.totalAcertos / totalQuestoes) * 100).toFixed(2)}%`,
      respostas: alunoData.respostas,
    }));

    // Avaliação dos descritores com base nos dados coletados em um único loop
    let melhorAproveitamento = null;
    let maiorDificuldade = null;
    let paraFicarDeOlho = null;
    let intermediario = null;

    descritoresStats.forEach((descritor) => {
      const aproveitamento = descritor.totalAcertos / descritor.totalQuestoes;

      if (!melhorAproveitamento || aproveitamento > melhorAproveitamento.aproveitamento) {
        melhorAproveitamento = { ...descritor, aproveitamento };
      }

      if (!maiorDificuldade || aproveitamento < maiorDificuldade.aproveitamento) {
        maiorDificuldade = { ...descritor, aproveitamento };
      }

      if (aproveitamento < 0.5) {
        paraFicarDeOlho = paraFicarDeOlho || { ...descritor, aproveitamento };
      } else if (aproveitamento >= 0.5 && aproveitamento < 0.7) {
        intermediario = intermediario || { ...descritor, aproveitamento };
      }
    });

    const avaliacaoPorDescritor = {
      melhorAproveitamento: melhorAproveitamento
        ? { codigo: melhorAproveitamento.codigo, descricao: melhorAproveitamento.descricao }
        : null,
      maiorDificuldade: maiorDificuldade
        ? { codigo: maiorDificuldade.codigo, descricao: maiorDificuldade.descricao }
        : null,
      paraFicarDeOlho: paraFicarDeOlho
        ? { codigo: paraFicarDeOlho.codigo, descricao: paraFicarDeOlho.descricao }
        : null,
      intermediario: intermediario
        ? { codigo: intermediario.codigo, descricao: intermediario.descricao }
        : null,
    };

    res.json({ questoes: Array.from(questoesSet), alunos, avaliacaoPorDescritor });
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

