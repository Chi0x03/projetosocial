const express = require('express');
const router = express.Router();
const descritorController = require('../controllers/descritorController');
const isAuthenticated = require('../middlewares/authMiddleware')

router.get('/', descritorController.getAllDescritors);

module.exports = router;