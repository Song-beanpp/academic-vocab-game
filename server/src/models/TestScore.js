const mongoose = require('mongoose');

const testScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  testType: {
    type: String,
    enum: ['pre', 'post', 'delayed'],
    required: true
  },
  scores: {
    vocabulary: {
      type: Number,
      min: 0,
      max: 100
    },
    collocation: {
      type: Number,
      min: 0,
      max: 100
    },
    frequency: {
      type: Number,
      min: 0
    },
    diversity: {
      type: Number,
      min: 0,
      max: 1
    },
    complexity: {
      type: Number,
      min: 0,
      max: 1
    },
    hedging: {
      type: Number,
      min: 1,
      max: 5
    },
    coherence: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure one test type per user
testScoreSchema.index({ userId: 1, testType: 1 }, { unique: true });

module.exports = mongoose.model('TestScore', testScoreSchema);
