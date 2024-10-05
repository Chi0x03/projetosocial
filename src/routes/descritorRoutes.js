const express = require('express');
const router = express.Router();
const descritorController = require('../controllers/descritorController');
const isAuthenticated = require('../middlewares/authMiddleware')

router.get('/', descritorController.getAllDescritors);
router.get('/:id', descritorController.getDescritor);
router.delete('/:id', descritorController.deleteDescritor)
router.post('/', descritorController.createDescritor);
router.post('/:id', descritorController.editDescritor);


module.exports = router;