const mongoose = require('mongoose');

const taskHistorySchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  module: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  taskType: {
    type: String,
    required: true
  },
  taskId: {
    type: String
  },
  correctRate: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  timeSpent: {
    type: Number,
    required: true // in seconds
  }
});

const dailyTaskHistorySchema = new mongoose.Schema({
  date: {
    type: String,
    required: true // YYYY-MM-DD format
  },
  completedCount: {
    type: Number,
    default: 0
  },
  totalCount: {
    type: Number,
    default: 4
  },
  totalTime: {
    type: Number,
    default: 0 // in seconds
  }
});

const gameProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  totalTime: {
    type: Number,
    default: 0 // in minutes
  },
  loginFrequency: {
    type: Number,
    default: 0 // number of days logged in
  },
  loginStreak: {
    type: Number,
    default: 0 // consecutive login days
  },
  lastLoginDate: {
    type: String,
    default: null // YYYY-MM-DD format
  },
  moduleBreakdown: {
    module1: { type: Number, default: 0 },
    module2: { type: Number, default: 0 },
    module3: { type: Number, default: 0 },
    module4: { type: Number, default: 0 }
  },
  taskHistory: [taskHistorySchema],
  completedTaskIds: [{
    type: String
  }],
  dailyTaskHistory: [dailyTaskHistorySchema],
  // Legacy fields for backward compatibility
  completedTasks: [{
    type: String
  }],
  lastLogin: {
    type: Date
  },
  streak: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Method to check if today is a new login day
gameProgressSchema.methods.isNewLoginDay = function() {
  if (!this.lastLoginDate) return true;
  const today = new Date().toISOString().split('T')[0];
  return today !== this.lastLoginDate;
};

// Method to get today's completed task IDs
gameProgressSchema.methods.getTodayCompletedTasks = function() {
  const today = new Date().toISOString().split('T')[0];
  return this.completedTaskIds.filter(id => id.startsWith(today));
};

// Method to check if all daily tasks are completed
gameProgressSchema.methods.allDailyTasksCompleted = function() {
  const todayTasks = this.getTodayCompletedTasks();
  return todayTasks.length >= 4;
};

module.exports = mongoose.model('GameProgress', gameProgressSchema);
