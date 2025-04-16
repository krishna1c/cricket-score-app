const mongoose = require('mongoose');

const PlayerStatsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['batsman', 'bowler', 'all-rounder', 'wicket-keeper'],
    default: 'batsman'
  },
  battingStyle: {
    type: String,
    default: 'right-handed'
  },
  bowlingStyle: String,
  runs: {
    type: Number,
    default: 0
  },
  ballsFaced: {
    type: Number,
    default: 0
  },
  fours: {
    type: Number,
    default: 0
  },
  sixes: {
    type: Number,
    default: 0
  },
  wickets: {
    type: Number,
    default: 0
  },
  ballsBowled: {
    type: Number,
    default: 0
  },
  runsConceded: {
    type: Number,
    default: 0
  },
  maidens: {
    type: Number,
    default: 0
  }
});

const TeamStatsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  players: [PlayerStatsSchema],
  score: {
    type: Number,
    default: 0
  },
  wickets: {
    type: Number,
    default: 0
  },
  balls: {
    type: Number,
    default: 0
  },
  extras: {
    type: Number,
    default: 0
  },
  currentBatsmen: {
    type: [Number],
    default: []
  },
  currentBowler: {
    type: Number,
    default: 0
  }
});

const MatchSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  settings: {
    overs: {
      type: Number,
      required: true,
      default: 20
    },
    venue: String,
    matchType: {
      type: String,
      enum: ['T20', 'ODI', 'Test'],
      default: 'T20'
    },
    umpires: String
  },
  team1: TeamStatsSchema,
  team2: TeamStatsSchema,
  currentInnings: {
    type: Number,
    enum: [1, 2],
    default: 1
  },
  currentTeam: {
    type: String,
    enum: ['team1', 'team2'],
    default: 'team1'
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started'
  },
  result: {
    winner: String,
    margin: Number,
    marginType: {
      type: String,
      enum: ['runs', 'wickets']
    }
  },
  ballByBall: [{
    innings: Number,
    over: Number,
    ball: Number,
    batsman: String,
    bowler: String,
    runs: Number,
    wicket: Boolean,
    wicketType: String,
    dismissedBatsman: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Match', MatchSchema);

