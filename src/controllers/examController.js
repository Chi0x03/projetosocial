const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const renameExam = async (req, res) => {
  const { novoNome } = req.body;
  const id = req.params.id;

  try {
    const provaEditada = await prisma.prova.update({
      where: {
        id
      }, data: {
        titulo: novoNome
      }
    })
    return res.json(provaEditada)
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Falha ao renomear prova" })
  }
}

function getRandomElements(arr, num) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
}

const generateExam = async (req, res) => {
  let { titulo, descritorIds, numQuestoesPorDescritor } = req.body;
  numQuestoesPorDescritor = parseInt(numQuestoesPorDescritor);

  try {
    const questoesPorDescritor = await prisma.questao.findMany({
      where: {
        descritorId: { in: descritorIds },
      },
      include: {
        descritor: true,
      },
    });

    let questoesSelecionadas = [];

    for (let descritorId of descritorIds) {
      const questoesFiltradas = questoesPorDescritor.filter(q => q.descritorId === descritorId);

      const questoesAleatorias = getRandomElements(questoesFiltradas, numQuestoesPorDescritor);

      questoesSelecionadas.push(...questoesAleatorias);
    }

    // Cria a prova primeiro, sem conectar as questões
    const prova = await prisma.prova.create({
      data: {
        titulo,
        dataCriacao: new Date(),
        professorId: req.session.professorId
        // Não conecte as questões aqui
      },
      include: {
        questoes: true, // Inclui questões, mas ainda não tem nenhuma
      },
    });

    // Agora conecta as questões à prova já criada
    await prisma.provasQuestoes.createMany({
      data: questoesSelecionadas.map((questao) => ({
        provaId: prova.id,
        questaoId: questao.id,
      })),
    });

    // Recarrega a prova com as questões
    const provaComQuestoes = await prisma.prova.findUnique({
      where: { id: prova.id },
      include: {
        questoes: {
          include: {
            questao: true, // Inclui todos os dados da questão
          },
        },
      },
    });

    res.status(201).json(provaComQuestoes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao gerar a prova' });
  }
};



// Cria uma nova prova
const createExam = async (req, res) => {
  const { titulo } = req.body;
  const professorId = req.session.professorId;

  try {
    const novaProva = await prisma.prova.create({
      data: {
        titulo,
        dataCriacao: new Date(),
        professorId
      }
    });
    res.status(201).json(novaProva);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar prova' });
  }
};

// Obtém uma prova específica
const getExam = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const professorId = req.session.professorId;

    const prova = await prisma.prova.findUnique({
      include: {
        questoes: {
          select: {
            questao: {
              select: {
                id: true,
                enunciado: true,
                alternativaA: true,
                alternativaB: true,
                alternativaC: true,
                alternativaD: true,
                alternativaE: true,
                respostaCorreta: true,
                explicacao: true,
                publica: true,
                professorId: true,
                descritorId: true,
                disciplina: true,
              }
            }
          }
        }
      },
      where: { id, professorId }
    });

    if (prova) {
      res.json({
        ...prova,
        questoes: prova.questoes.map(q => q.questao)
      });
    } else {
      res.status(404).json({ error: 'Prova não encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter a prova' });
  }
};



// Busque todas as provas de um professor
const getExamsByProfessor = async (req, res) => {
  const professorId = req.session.professorId;

  const provas = await prisma.prova.findMany({
    where: { professorId },
  });

  if (!provas) {
    return res.status(404).json({ error: 'Nenhuma prova encontrada' });
  }
  res.json(provas);
}

// Adiciona questões a uma prova
const addQuestionsToExam = async (req, res) => {
  const provaId = parseInt(req.params.id);
  const { questaoIds } = req.body;

  console.log(questaoIds);

  if (!Array.isArray(questaoIds)) {
    return res.status(400).json({ error: 'questaoIds deve ser um array de IDs' });
  }

  try {
    const provasQuestoes = questaoIds.map((id, index) => ({
      provaId,
      questaoId: id,
    }));

    await prisma.provasQuestoes.createMany({
      data: provasQuestoes
    });

    res.status(200).json({ message: 'Questões associadas com sucesso à prova' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erro ao associar questões à prova' });
  }
};

const deleteQuestionsFromExam = async (req, res) => {
  const provaId = parseInt(req.params.id);
  const { questaoIds } = req.body;

  if (!Array.isArray(questaoIds)) {
    return res.status(400).json({ error: 'questaoIds deve ser um array de IDs' });
  }

  try {
    const provasQuestoes = questaoIds.map(id => ({
      provaId,
      questaoId: id
    }));

    await prisma.provasQuestao.deleteMany({
      data: provasQuestoes
    });

    res.status(200).json({ message: 'Questões associadas com sucesso à prova' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao associar questões à prova' });
  }
}

module.exports = {
  createExam,
  getExam,
  addQuestionsToExam,
  deleteQuestionsFromExam,
  generateExam,
  renameExam,
  getExamsByProfessor
};
