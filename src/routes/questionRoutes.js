const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const isAuthenticated = require('../middlewares/authMiddleware');

router.post('/', isAuthenticated, questionController.createQuestion);
router.post('/:id', /*isAuthenticated,*/ questionController.editQuestion);
router.delete('/:id', questionController.deleteQuestion)
router.get('/', /*isAuthenticated,*/ questionController.getAllQuestions);
router.get('/:id',  questionController.getQuestion);
router.get('/questao-by-descritor/:id', questionController.getQuestionsByDescritor);

module.exports = router;
