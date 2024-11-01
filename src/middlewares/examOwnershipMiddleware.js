const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function ownsExam(req, res, next) {
  const professorId = req.session.professorId;
  const provaId = parseInt(req.params.id);
  
  try {
    const prova = await prisma.prova.findUnique({
      where: { id: provaId },
      select: { professorId: true }
    });

    if (prova?.professorId === professorId) {
      return next();
    }

    res.status(403).json({ error: 'Você não tem permissão para acessar esta prova.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao verificar propriedade da prova.' });
  }
}

module.exports = ownsExam;
