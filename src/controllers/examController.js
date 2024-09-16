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

const generateExam = async (req, res) => {
  const { titulo, descritorIds, numQuestoesPorDescritor } = req.body;

  try {
    // Busca as questões que têm os descritores selecionados
    const questoesPorDescritor = await prisma.questao.findMany({
      where: {
        descritores: {
          some: {
            id: {
              in: descritorIds, // Seleciona as questões que têm os descritores
            },
          },
        },
      },
      include: {
        descritores: true, // Inclui os descritores na busca
      },
    });

    // Organiza as questões por descritor
    let questoesSelecionadas = [];

    for (let descritorId of descritorIds) {
      // Filtra questões para o descritor específico
      const questoesFiltradas = questoesPorDescritor.filter(q =>
        q.descritores.some(d => d.id === descritorId)
      );

      // Seleciona questões aleatórias para esse descritor
      const questoesAleatorias = getRandomElements(questoesFiltradas, numQuestoesPorDescritor);
      questoesSelecionadas.push(...questoesAleatorias);
    }

    // Cria a prova com as questões selecionadas
    const prova = await prisma.prova.create({
      data: {
        titulo,
        descritores: {
          connect: descritorIds.map(id => ({ id })),
        },
        questoes: {
          connect: questoesSelecionadas.map(questao => ({ id: questao.id })),
        },
      },
      include: {
        questoes: true, // Inclui as questões na resposta
      },
    });

    res.status(201).json(prova);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar a prova' });
  }
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
  renameExam
};
