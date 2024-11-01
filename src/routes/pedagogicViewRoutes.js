const express = require('express');
const router = express.Router();
const pedagogicViewController = require('../controllers/pedagogicViewController');
const isAuthenticated = require('../middlewares/authMiddleware');

router.get('/', isAuthenticated, pedagogicViewController.getPedagogicView);

router.post('/:id/add-answer', isAuthenticated, pedagogicViewController.addAnswer);

module.exports = router