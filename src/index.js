const express = require('express');
const session = require('express-session');
const app = express();
const examRoutes = require('./routes/examRoutes');
const questionRoutes = require('./routes/questionRoutes');
const descritorRoutes = require('./routes/descritorRoutes');
const authRoutes = require('./routes/authRoutes')

app.use(express.json());

// Configuração de sessão
app.use(session({
  secret: 'sua_chave_secreta_aqui69',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true } // Defina como true se estiver usando HTTPS
}));

// Rotas
app.use('/provas', examRoutes);
app.use('/questoes', questionRoutes);
app.use('/descritores', descritorRoutes);
app.use('/auth', authRoutes); // Rota de autenticação


const port = 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
