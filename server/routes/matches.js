const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

// Routes
router.post('/', matchController.createMatch);
router.get('/', matchController.getMatches);
router.get('/recent', matchController.getRecentMatches);
router.get('/:id', matchController.getMatch);
router.put('/:id', matchController.updateMatch);
router.delete('/:id', matchController.deleteMatch);
router.post('/:id/ball', matchController.updateBallByBall);

module.exports = router;

