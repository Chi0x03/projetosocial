const express = require('express');
const session = require('express-session');
const cors = require('cors');
const app = express();
app.use(cors());


const examRoutes = require('./routes/examRoutes');
const questionRoutes = require('./routes/questionRoutes');
const descritorRoutes = require('./routes/descritorRoutes');
const authRoutes = require('./routes/authRoutes')
const teacherRoutes = require('./routes/teacherRoutes')

const isAuthenticated = require('./middlewares/authMiddleware')

app.use(express.json());
app.use(express.static('./src/public'))

app.set('view engine', 'ejs');
app.set('views', './src/views');

// Configuração de sessão
app.use(session({
  secret: 'sua_chave_secreta_aqui',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Defina como true se estiver usando HTTPS
}));

// Rotas
app.use('/provas', examRoutes);
app.use('/questoes', questionRoutes);
app.use('/descritores', descritorRoutes);
app.use('/professor', teacherRoutes)
app.use('/auth', authRoutes); // Rota de autenticação

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/CadastroPG.html', (req, res) => {
  res.render('CadastroPG')
})

app.get('/LoginPG.html', (req, res) => {
  res.render('LoginPG')
})

app.get('/perfil_prof.html', isAuthenticated , (req, res) => {
  res.render('perfil_prof')
})

const port = 8080;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
