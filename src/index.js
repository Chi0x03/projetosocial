const express = require('express');
const session = require('express-session');
const cors = require('cors');
const app = express();
app.use(cors());


// const examRoutes = require('./routes/examRoutes');
const questionRoutes = require('./routes/questionRoutes');
const descritorRoutes = require('./routes/descritorRoutes');
const authRoutes = require('./routes/authRoutes')

app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', './src/views');

// Configuração de sessão
app.use(session({
  secret: 'sua_chave_secreta_aqui',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Defina como true se estiver usando HTTPS
}));

// Rotas
// app.use('/provas', examRoutes);
app.use('/questoes', questionRoutes);
app.use('/descritores', descritorRoutes);
app.use('/auth', authRoutes); // Rota de autenticação

// app.get('/dashboard/questoes', (req, res) => {
//   res.render('questoes')
// })

const port = 8080;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
