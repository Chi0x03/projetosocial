const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const generateExam = async (req, res) => {
  
}

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
  const id = parseInt(req.params.id);
  const professorId = req.session.professorId;

  const prova = await prisma.prova.findUnique({
    include: {
      questoes: true
    },
    where: { id, professorId }
  });

  if (prova) {
    res.json(prova);
  } else {
    res.status(404).json({ error: 'Prova não encontrada' });
  }
};

// Lista todas as questões de uma prova específica
// const getExamQuestions = async (req, res) => {
//   const provaId = parseInt(req.params.id);

//   const questoes = await prisma.questao.findMany({
//     where: {
//       provas: {
//         some: { provaId }
//       }
//     }
//   });

//   res.json(questoes);
// };

// Adiciona questões a uma prova
const addQuestionsToExam = async (req, res) => {
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

    await prisma.provasQuestao.createMany({
      data: provasQuestoes
    });

    res.status(200).json({ message: 'Questões associadas com sucesso à prova' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao associar questões à prova' });
  }
};

module.exports = {
  createExam,
  getExam,
  addQuestionsToExam,
};
