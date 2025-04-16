const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  dateOfBirth: Date,
  battingStyle: {
    type: String,
    default: 'right-handed'
  },
  bowlingStyle: String,
  role: {
    type: String,
    enum: ['batsman', 'bowler', 'all-rounder', 'wicket-keeper'],
    default: 'batsman'
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  stats: {
    matches: {
      type: Number,
      default: 0
    },
    runs: {
      type: Number,
      default: 0
    },
    highestScore: {
      type: Number,
      default: 0
    },
    battingAverage: {
      type: Number,
      default: 0
    },
    centuries: {
      type: Number,
      default: 0
    },
    halfCenturies: {
      type: Number,
      default: 0
    },
    wickets: {
      type: Number,
      default: 0
    },
    bestBowling: String,
    bowlingAverage: {
      type: Number,
      default: 0
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Player', PlayerSchema);

