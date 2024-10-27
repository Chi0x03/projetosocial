const express = require('express');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// Registrar novo usuário
router.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    // Verificar se o e-mail já está em uso
    const usuarioExistente = await prisma.professor.findUnique({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'E-mail já cadastrado' });
    }

    // Criar hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar novo usuário
    const novoProfessor = await prisma.professor.create({
      data: {
        nome,
        email,
        senha: senhaHash
      }
    });

    novoProfessor.senha = undefined

    req.session.professorId = novoProfessor.id;
    res.status(201).json({ message: 'Usuário criado com sucesso', professor: novoProfessor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const professor = await prisma.professor.findUnique({ where: { email } });
    if (!professor) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const senhaCorreta = await bcrypt.compare(senha, professor.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    req.session.professorId = professor.id;
    res.json({ message: 'Login bem-sucedido' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao fazer logout' });
    }
    res.json({ message: 'Logout bem-sucedido' });
  });
});

module.exports = router;
