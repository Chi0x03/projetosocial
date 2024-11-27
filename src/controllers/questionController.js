const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const deleteQuestion = async (req, res) => {
  const questionId = parseInt(req.params.id)
  const professorId = req.session.professorId

  try {
    const deletedQuestion = await prisma.questao.delete({
      where: {
        id: questionId,
        professorId
      }
    })
    res.json(deletedQuestion)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Erro ao deletar questão' });
  }
}

const getQuestionsByProfessor = async (req, res) => {
  const professorId = req.session.professorId
  try {
    const questions = await prisma.questao.findMany({
      where: {
        professorId
      },
      include: {
        descritor: {
          select: {
            codigo: true,
            descricao: true
          }
        }
      }
    })
    res.json(questions)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Erro ao buscar questões do professor' });
  }
}

const editQuestion = async (req, res) => {
  let { enunciado, alternativaA, alternativaB, alternativaC, alternativaD, alternativaE, respostaCorreta, descritorId, disciplina } = req.body;
  const questionId = parseInt(req.params.id)
  const professorId = req.session.professorId
  descritorId = parseInt(descritorId)
  if (typeof questionId != 'number') res.status(500).json( {error: "Id não informado ou inválido"} )
  
  try {
    const questaoEditada = await prisma.questao.update({
      where: {
        id: questionId,
        professorId
      },
      data: {
        enunciado,
        alternativaA,
        alternativaB,
        alternativaC,
        alternativaD,
        alternativaE,
        respostaCorreta,
        // publica,
        descritorId,
        disciplina,
        professorId
      }
    });
    res.status(201).json(questaoEditada);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Erro ao editar questão' });
  }
}

const getQuestionsByDescritor = async (req, res) => {
  const descritorId = parseInt(req.params.id);
  if (typeof descritorId != 'number') {
    return res.status(500).json({ error: "Id não informado ou inválido" });
  }

  try {
    const questoes = await prisma.questao.findMany({
      where: {
        descritorId,
        publica: true
      },
    });

    res.json(questoes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erro ao buscar questões' });
  }
};


const createQuestion = async (req, res) => {
  let { enunciado, alternativaA, alternativaB, alternativaC, alternativaD, alternativaE, respostaCorreta, explicacao, publica, descritorId, disciplina } = req.body;
  const professorId = req.session.professorId || 1;
  descritorId = parseInt(descritorId)
  console.log(req.body)
  try {
    const novaQuestao = await prisma.questao.create({
      data: {
        enunciado,
        alternativaA,
        alternativaB,
        alternativaC,
        alternativaD,
        alternativaE,
        respostaCorreta,
        publica,
        explicacao,
        descritorId,
        disciplina,
        professorId
      }
    });
    res.status(201).json(novaQuestao);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Erro ao criar questão' });
  }
};

// Lista todas as questões disponíveis para o professor logado
const getAllQuestions = async (req, res) => {
  const professorId = req.session.professorId || 1;

  const questoes = await prisma.questao.findMany({
    where: {
      OR: [
        { publica: true },
        { professorId }
      ]
    },
  });

  res.json(questoes);
};

// Obtém uma questão específica
const getQuestion = async (req, res) => {
  const id = parseInt(req.params.id);
  const professorId = req.session.professorId;

  const questao = await prisma.questao.findFirst({
    where: {
      id,
      OR: [
        { publica: true },
        { professorId }
      ]
    }
  });

  if (questao) {
    res.json(questao);
  } else {
    res.status(404).json({ error: 'Questão não encontrada' });
  }
};

module.exports = {
  createQuestion,
  getAllQuestions,
  getQuestion,
  editQuestion,
  deleteQuestion,
  getQuestionsByDescritor,
  getQuestionsByProfessor
};
