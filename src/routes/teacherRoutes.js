const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/authMiddleware');
const teacherController = require('../controllers/teacherController')

router.get('/', isAuthenticated, teacherController.getTeacher)
router.post('/update', isAuthenticated, teacherController.updateTeacher)

module.exports = router