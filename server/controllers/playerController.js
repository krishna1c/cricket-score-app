const Player = require('../models/Player');
const Team = require('../models/Team');

// Create player
exports.createPlayer = async (req, res) => {
  try {
    const newPlayer = new Player(req.body);
    const savedPlayer = await newPlayer.save();
    
    // If player is assigned to a team, update the team as well
    if (req.body.team) {
      await Team.findByIdAndUpdate(req.body.team, {
        $push: { players: savedPlayer._id }
      });
    }
    
    res.status(201).json(savedPlayer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all players
exports.getPlayers = async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add multiple players
// Add multiple players
exports.addPlayers = async (req, res) => {
  try {
    // Create players
    const players = await Player.insertMany(req.body.players);
    
    // If teamId is provided, associate all players with the team
    if (req.body.teamId) {
      const teamId = req.body.teamId;
      const playerIds = players.map(player => player._id);
      
      await Team.findByIdAndUpdate(teamId, {
        $push: { players: { $each: playerIds } }
      });
    }
    
    res.status(201).json(players);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get player by ID
exports.getPlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id).populate('team');
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    res.json(player);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update player
exports.updatePlayer = async (req, res) => {
  try {
    // Check if team is being changed
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    
    const oldTeamId = player.team;
    const newTeamId = req.body.team;
    
    // Update player
    const updatedPlayer = await Player.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    // Handle team updates if team changed
    if (newTeamId && oldTeamId && newTeamId.toString() !== oldTeamId.toString()) {
      // Remove from old team
      await Team.findByIdAndUpdate(oldTeamId, {
        $pull: { players: player._id }
      });
      
      // Add to new team
      await Team.findByIdAndUpdate(newTeamId, {
        $push: { players: player._id }
      });
    } else if (newTeamId && !oldTeamId) {
      // Add to new team when there was no old team
      await Team.findByIdAndUpdate(newTeamId, {
        $push: { players: player._id }
      });
    } else if (!newTeamId && oldTeamId) {
      // Remove from old team when there is no new team
      await Team.findByIdAndUpdate(oldTeamId, {
        $pull: { players: player._id }
      });
    }
    
    res.json(updatedPlayer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete player
exports.deletePlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    
    // Remove player from team if assigned
    if (player.team) {
      await Team.findByIdAndUpdate(player.team, {
        $pull: { players: player._id }
      });
    }
    
    await Player.findByIdAndDelete(req.params.id);
    res.json({ message: 'Player deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get player stats
exports.getPlayerStats = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    
    res.json(player.stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update player stats
exports.updatePlayerStats = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    
    player.stats = { ...player.stats, ...req.body };
    const updatedPlayer = await player.save();
    
    res.json(updatedPlayer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

