const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

// Routes
router.post('/', playerController.createPlayer);
router.get('/', playerController.getPlayers);
router.get('/:id', playerController.getPlayer);
router.put('/:id', playerController.updatePlayer);
router.delete('/:id', playerController.deletePlayer);
router.post('/bulk', playerController.addPlayers);

module.exports = router;