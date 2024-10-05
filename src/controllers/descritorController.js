const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const editDescritor = async (req, res) => {
  const data = req.body
  const id = parseInt(req.params.id)

  try {
    const descritorEditado = await prisma.descritor.update({
      where: {
        id
      }, data
    })
    return res.json(descritorEditado)
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Falha ao editar descritor" })
  }
}

const createDescritor = async (req, res) => {
  const data = req.body;

  try {
    const novoDescritor = await prisma.descritor.create({
      data
    });
    return res.json(novoDescritor);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Falha ao criar descritor" });
  }
}

const deleteDescritor = async (req, res) => {
  const id = parseInt(req.params.id)

  try {
    const deletedDescritor = await prisma.descritor.delete({
      where: {
        id
      }
    })
    res.json(deletedDescritor)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Erro ao deletars questão' });
  }
}

const getAllDescritors = async (req, res) => {
  try {
    const descritores = await prisma.descritor.findMany()
    return res.json(descritores)
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Falha as retornar todos os descritores " })
  }
}

const getDescritor = async (req, res) => {
  const id = parseInt(req.params.id)

  const descritor = await prisma.descritor.findFirst({
    where: {
      id
    }
  });

  if (descritor) {
    res.json(descritor);
  } else {
    res.status(404).json({ error: 'Descritor não encontrado' });
  }
}

module.exports = {
  editDescritor,
  createDescritor,
  getAllDescritors,
  getDescritor,
  deleteDescritor
}