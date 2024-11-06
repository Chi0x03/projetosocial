// src/controllers/pedagogicViewController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getPedagogicView = async (req, res) => {
  try {
    const respostasDeProvas = await prisma.respostasDeProvas.findMany({
      where: { provaId: req.params.id },
      include: {
        questao: true,
      },
    });

    const questoesSet = new Set();
    const alunosMap = new Map();

    respostasDeProvas.forEach((resposta) => {
      questoesSet.add(resposta.questao.id);

      if (!alunosMap.has(resposta.aluno)) {
        alunosMap.set(resposta.aluno, {
          nome: resposta.aluno,
          totalAcertos: 0,
          respostas: [],
        });
      }

      const alunoData = alunosMap.get(resposta.aluno);
      alunoData.respostas.push({
        questao: resposta.questao.id,
        itemMarcado: resposta.itemMarcado,
        acertou: resposta.acertou,
      });

      if (resposta.acertou) {
        alunoData.totalAcertos++;
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
    const ranking = await prisma.ranking.findFirst({
      where: { provaId },
      orderBy: [
        {
          totalAcertos: 'desc'
        },
        {
          tempoDeResposta: 'asc'
        }
      ]
    });

    // Envia a resposta com os dados do ranking
    res.json(ranking);
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

