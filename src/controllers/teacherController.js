const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getTeacher = async (req, res) => {
  const teacherId = req.session.professorId;
  try {
    const professor = await prisma.professor.findUnique({
      where: { id: teacherId },
      select: {
        nome: true,
        email: true,
        instituicao: true,
        disciplina: true
      }
    });
    res.json(professor);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "erro ao encontrar professor" });
  }
};


const updateTeacher = async (req, res) => {;
  const professorId = req.session.professorId
  console.log(req.body)

  try {
    let professorEditado = await prisma.professor.update({
      where: {
        id: professorId
      },
      data: req.body
    });

    professorEditado.senha = undefined;
    
    res.status(201).json(professorEditado);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "erro ao atualizar professor" })
  }
}

module.exports = {
  updateTeacher,
  getTeacher
}