const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const isAuthenticated = require('../middlewares/authMiddleware');
const ownsExam = require('../middlewares/examOwnershipMiddleware');

router.get('/:id', isAuthenticated, ownsExam, examController.getExam);
router.get('/', isAuthenticated, ownsExam, examController.getAllExams);
// router.get('/:id/questoes', isAuthenticated, ownsExam, examController.getExamQuestions);

router.post('/', isAuthenticated, examController.createExam);
router.post('/generate', isAuthenticated, examController.generateExam); // not implemented

router.post('/:id/questoes', isAuthenticated, ownsExam, examController.addQuestionsToExam);

module.exports = router;
