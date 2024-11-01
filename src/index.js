const express = require('express');
const session = require('express-session');
const cors = require('cors');
const http = require('http'); // Importa o módulo http para criar o servidor
const socketIo = require('socket.io'); // Importa o Socket.IO
const app = express();

// Configurações do servidor e do Socket.IO
const server = http.createServer(app); // Cria o servidor HTTP
const io = socketIo(server); // Inicializa o Socket.IO com o servidor HTTP

app.use(cors());

const examRoutes = require('./routes/examRoutes');
const questionRoutes = require('./routes/questionRoutes');
const descritorRoutes = require('./routes/descritorRoutes');
const authRoutes = require('./routes/authRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const pedagogicViewRoutes = require('./routes/pedagogicViewRoutes');

const isAuthenticated = require('./middlewares/authMiddleware');

app.use(express.json());
app.use(express.static('./src/public'));

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
app.use('/professor', teacherRoutes);
app.use('/auth', authRoutes);
app.use('/vista_pedagocia', pedagogicViewRoutes);

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/CadastroPG.html', (req, res) => {
  res.render('CadastroPG');
});

app.get('/LoginPG.html', (req, res) => {
  res.render('LoginPG');
});

app.get('/perfil_prof.html', isAuthenticated , (req, res) => {
  res.render('perfil_prof');
});

app.get('/professor_questoes.html', isAuthenticated, (req, res) => {
  res.render('professor_questoes');
});

app.get('/pag_questao.html', (req, res) => {
  res.render('pag_questao');
})

app.get('/EntrarPG.html', (req, res) => {
  res.render('EntrarPG');
});

app.get('/boa_sorte.html', (req, res) => {
  res.render('boa_sorte');
});

app.get('/ContPG.html', (req, res) => {
  res.render('ContPG');
});

app.get('/sala.html', (req, res) => {
  res.render('sala');
});


// Rota para os alunos se conectarem à salaconst currentQuestions = {}; // Objeto para armazenar a questão atual de cada sala
const currentQuestions = {};

io.on('connection', (socket) => {
  console.log('Aluno conectado', socket.id);

  socket.on('join-quiz', ({ roomId, nome }) => {
    socket.join(roomId);
    console.log(`Aluno ${nome} entrou na sala ${roomId}`);

    // Envia a contagem de alunos na sala
    io.to(roomId).emit('alunos-count', { count: socket.adapter.rooms.get(roomId).size });

    // Envia a questão atual para o aluno que entrou
    if (currentQuestions[roomId]) {
      socket.emit('question', currentQuestions[roomId]); // Envia a questão atual
    }

    socket.on('disconnect', () => {
      console.log('Aluno desconectado', socket.id);
      io.to(roomId).emit('alunos-count', { count: socket.adapter.rooms.get(roomId).size });
    });
  });

  socket.on('primeira-questao', ({ roomId, provaId, question }) => {
    currentQuestions[roomId] = { question, provaId }; // Armazena a questão atual
    io.to(roomId).emit('question', { question, provaId });
  });

  // Recebe a solicitação para passar para a próxima questão
  socket.on('next-question', async ({ roomId, currentQuestion }) => {
    currentQuestions[roomId] = currentQuestion; // Atualiza a questão atual
    io.to(roomId).emit('question', currentQuestion);
  });

  socket.on('answer', ({ roomId, itemMarcado, nome }) => {
    console.log(`Aluno ${nome} respondeu com ${itemMarcado}`);
    io.to(roomId).emit('answer-prof', { itemMarcado, nome });
  });
});


// Inicia o servidor na porta 8080
const port = 8080;
server.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
