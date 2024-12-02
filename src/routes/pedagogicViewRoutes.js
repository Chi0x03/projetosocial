const express = require('express');
const router = express.Router();
const pedagogicViewController = require('../controllers/pedagogicViewController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

router.get('/:id', isAuthenticated, pedagogicViewController.getPedagogicView);

router.get('/ranking/:id', pedagogicViewController.getRanking);

router.post('/:id/add-answer', pedagogicViewController.addAnswer);

module.exports = router