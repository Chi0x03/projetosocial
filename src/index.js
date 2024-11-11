const express = require('express');
const session = require('express-session');
const cors = require('cors');
const http = require('http'); // Importa o módulo http para criar o servidor
const socketIo = require('socket.io'); // Importa o Socket.IO
const app = express();
const path = require('path');

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
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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
app.use('/vista_pedagogica', pedagogicViewRoutes);

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

app.get('/ajuda.html', isAuthenticated, (req, res) => {
  res.render('ajuda');
});

app.get('/resultados.html', isAuthenticated, (req, res) => {
  res.render('resultados');
});

app.get('/BancoQuestoes.html', isAuthenticated, (req, res) => {
  res.render('BancoQuestoes');
});

app.get('/MinhasProvas.html', isAuthenticated, (req, res) => {
  res.render('MinhasProvas');
});

app.get('/MontarP1.html', isAuthenticated, (req, res) => {
  res.render('MontarP1');
});

app.get('/MontarP2.html', isAuthenticated, (req, res) => {
  res.render('MontarP2');
});

app.get('/RankPG.html', (req, res) => {
  res.render('RankPG');
})

// Rota para os alunos se conectarem à salaconst currentQuestions = {}; // Objeto para armazenar a questão atual de cada sala
const currentQuestions = {};
const answersCount = {}; // Armazena a contagem de respostas por sala
const provaIds = {}; // Armazena o provaId para cada sala

io.on('connection', (socket) => {
  console.log('Aluno conectado', socket.id);

  socket.on('join-quiz', ({ roomId, nome, isProfessor, question, provaId }) => {
    socket.join(roomId);
    socket.isProfessor = isProfessor;
    console.log(`Aluno ${nome} conectado na sala ${roomId}`, socket.id);

    // Define a questão atual se não estiver definida ainda
    if (!currentQuestions[roomId]) {
      currentQuestions[roomId] = question;
    }

    // Inicializa a contagem de respostas para a sala
    if (!answersCount[roomId]) {
      answersCount[roomId] = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    }

    // Armazena o ID da prova quando o professor entra
    if (isProfessor) {
      currentQuestions[roomId] = question;
      provaIds[roomId] = provaId; // Salva o provaId para a sala
    }

    // Envia a questão atual para o aluno que entrou
    socket.emit('question', { question: currentQuestions[roomId], provaId });

    // Emite a quantidade de alunos na sala
    io.to(roomId).emit('alunos-count', { count: io.sockets.adapter.rooms.get(roomId).size, aluno: 'Aluno', id: socket.id });

    io.to(roomId).emit('status-list', { nome, id: socket.id });

    // Envia a contagem inicial para o professor ao entrar na sala
    socket.on('disconnect', () => {
      console.log('Aluno desconectado', socket.id);
      io.to(roomId).emit('aluno-desconectado', { id: socket.id });
      
      // Opcional: limpar a sala quando o último aluno sair
      if (!io.sockets.adapter.rooms.get(roomId)) {
        delete currentQuestions[roomId];
        delete answersCount[roomId];
        delete provaIds[roomId]; // Limpa o provaId quando a sala estiver vazia
      }
    });
  });

  socket.on('next-question', async ({ roomId, currentQuestion }) => {
    // Reinicia a contagem de respostas para a nova questão
    answersCount[roomId] = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    currentQuestions[roomId] = currentQuestion;

    // Emite a nova questão e a contagem reiniciada para todos na sala
    io.to(roomId).emit('question', { question: currentQuestion });
    io.to(roomId).emit('update-answer-count', answersCount[roomId]); // Envia a contagem zerada ao professor
  });

  socket.on('answer', ({ roomId, itemMarcado, alunoId }) => {
    // Incrementa a contagem de respostas
    if (!answersCount[roomId]) answersCount[roomId] = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    answersCount[roomId][itemMarcado]++;
    console.log(answersCount[roomId]);
    
    // Envia a atualização ao professor com a contagem de respostas
    io.to(roomId).emit('update-answer-count', answersCount[roomId]);

    // Notifica o professor que o aluno respondeu para atualizar o ícone
    io.to(roomId).emit('aluno-answered', { alunoId });
  });

  socket.on('finish-quiz', ({ roomId, provaId }) => {
    // Envia o ID da prova junto com o evento de quiz concluído
    io.to(roomId).emit('quiz-completed', { provaId });
  });
});




// Inicia o servidor na porta 8080
const port = 8080;
server.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
