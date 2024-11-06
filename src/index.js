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

app.get('/sala.html', isAuthenticated, (req, res) => {
  res.render('sala');
});

app.get('/ajuda.html', (req, res) => {
  res.render('ajuda');
});

app.get('/resultados.html' /*, isAuthenticated*/, (req, res) => {
  res.render('resultados');
});

app.get('/BancoQuestoes.html', (req, res) => {
  res.render('BancoQuestoes');
});

app.get('/MinhasQuestoes.html', (req, res) => {
  res.render('MinhasQuestoes');
});

app.get('/MontarP1.html', (req, res) => {
  res.render('MontarP1');
});

app.get('/MontarP2.html', (req, res) => {
  res.render('MontarP2');
});

// Rota para os alunos se conectarem à salaconst currentQuestions = {}; // Objeto para armazenar a questão atual de cada sala
const currentQuestions = {};
const answersCount = {}; // Armazena a contagem de respostas por sala

io.on('connection', (socket) => {
  console.log('Aluno conectado', socket.id);

  socket.on('join-quiz', ({ roomId, nome, isProfessor }) => {
    socket.join(roomId);
    console.log(`Questão atual: ${currentQuestions[roomId]}`);
    socket.isProfessor = isProfessor;

    // Inicializa a contagem de respostas para a sala
    if (!answersCount[roomId]) {
      answersCount[roomId] = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    }

    // Envia a contagem inicial para o professor ao entrar na sala
    if (isProfessor) {
      socket.emit('answers-count', answersCount[roomId]);
    }

    console.log(`Aluno ${nome} conectado na sala ${roomId}`, socket.id);

    socket.on('disconnect', () => {
      console.log('Aluno desconectado', socket.id);
      io.to(roomId).emit('aluno-desconectado', { id: socket.id });
    });
  });

  socket.on('primeira-questao', ({ roomId, provaId, question }) => {
    currentQuestions[roomId] = { question, provaId };
    io.to(roomId).emit('question', { question, provaId });
  });

  socket.on('next-question', async ({ roomId, currentQuestion }) => {
    // Reinicia a contagem de respostas para a nova questão
    answersCount[roomId] = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    currentQuestions[roomId] = currentQuestion;

    // Emite a nova questão e a contagem reiniciada para todos na sala
    io.to(roomId).emit('question', currentQuestion);
    io.to(roomId).emit('answers-count', answersCount[roomId]); // Envia a contagem zerada ao professor
  });

  socket.on('answer', ({ roomId, itemMarcado, alunoId }) => {
    // Incrementa a contagem de respostas
    if (!answersCount[roomId]) answersCount[roomId] = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    answersCount[roomId][itemMarcado]++;
    
    // Envia a atualização ao professor com a contagem de respostas
    io.to(roomId).emit('update-answer-count', answersCount[roomId]);

    // Notifica o professor que o aluno respondeu para atualizar o ícone
    io.to(roomId).emit('aluno-answered', { alunoId });
  });
});




// Inicia o servidor na porta 8080
const port = 8080;
server.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
