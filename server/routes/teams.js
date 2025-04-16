const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

// Routes
router.post('/', teamController.createTeam);
router.get('/', teamController.getTeams);
router.get('/:id', teamController.getTeam);
router.put('/:id', teamController.updateTeam);
router.delete('/:id', teamController.deleteTeam);
router.post('/:id/players', teamController.addPlayer);
router.delete('/:id/players/:playerId', teamController.removePlayer);

module.exports = router; // Ensure this line exists