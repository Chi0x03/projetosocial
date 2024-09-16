const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const isAuthenticated = require('../middlewares/authMiddleware');
const ownsExam = require('../middlewares/examOwnershipMiddleware');

router.get('/:id', isAuthenticated, ownsExam, examController.getExam);
// router.get('/', isAuthenticated, ownsExam, examController.getAllExams);

router.post('/', isAuthenticated, examController.createExam);
router.post('/:id/rename', isAuthenticated, ownsExam, examController.renameExam);
router.post('/generate', isAuthenticated, examController.generateExam); // not implemented

router.post('/:id/questoes', isAuthenticated, ownsExam, examController.addQuestionsToExam);
router.delete('/:id/questoes', isAuthenticated, ownsExam, examController.deleteQuestionsFromExam);

module.exports = router;
