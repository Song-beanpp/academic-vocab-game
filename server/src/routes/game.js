const express = require('express');
const router = express.Router();
const GameProgress = require('../models/GameProgress');
const TestScore = require('../models/TestScore');
const { protect, experimentalOnly } = require('../middleware/auth');
const {
  generateDailyTasks,
  calculateLoginStreak,
  getDateString
} = require('../utils/taskGenerator');

// @route   GET /api/game/daily-tasks
// @desc    Get daily tasks (fixed for each day)
// @access  Private (Experimental group only)
router.get('/daily-tasks', protect, experimentalOnly, async (req, res) => {
  try {
    const userId = req.user._id;
    const today = getDateString();

    // Get or create user progress
    let progress = await GameProgress.findOne({ userId });
    if (!progress) {
      progress = await GameProgress.create({ userId });
    }

    // Update login streak if new day
    if (progress.isNewLoginDay()) {
      const newStreak = calculateLoginStreak(
        progress.lastLoginDate,
        today,
        progress.loginStreak
      );

      progress.loginStreak = newStreak;
      progress.lastLoginDate = today;
      progress.loginFrequency += 1;
      progress.lastLogin = new Date();

      await progress.save();
    }

    // Generate daily tasks (deterministic based on userId + date)
    const { date, tasks } = generateDailyTasks(userId, today);

    // Mark completed tasks
    const completedToday = progress.completedTaskIds.filter(id => id.startsWith(today));
    tasks.forEach(task => {
      task.completed = completedToday.includes(task.id);
    });

    const allCompleted = completedToday.length >= 4;

    res.json({
      date,
      tasks,
      allCompleted,
      todayCompleted: completedToday.length,
      todayTotal: 4,
      loginStreak: progress.loginStreak
    });
  } catch (error) {
    console.error('Get daily tasks error:', error);
    res.status(500).json({ message: 'Error generating daily tasks' });
  }
});

// @route   GET /api/game/task/:taskId
// @desc    Get specific task data
// @access  Private (Experimental group only)
router.get('/task/:taskId', protect, experimentalOnly, async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user._id;

    // Parse task ID format: YYYY-MM-DD-module-taskType
    const parts = taskId.split('-');
    if (parts.length < 5) {
      return res.status(400).json({ message: 'Invalid task ID format' });
    }

    const date = `${parts[0]}-${parts[1]}-${parts[2]}`;
    const module = parseInt(parts[3]);
    const taskType = parts.slice(4).join('-');

    // Regenerate tasks for that date to get the data
    const { tasks } = generateDailyTasks(userId, date);
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if already completed
    const progress = await GameProgress.findOne({ userId });
    task.completed = progress?.completedTaskIds?.includes(taskId) || false;

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Error loading task' });
  }
});

// @route   POST /api/game/submit-task
// @desc    Submit task results and update progress
// @access  Private (Experimental group only)
router.post('/submit-task', protect, experimentalOnly, async (req, res) => {
  try {
    const { taskId, module, taskType, correctRate, timeSpent } = req.body;
    const userId = req.user._id;
    const today = getDateString();

    // Validate input
    if (!taskId || !module || !taskType || correctRate === undefined || !timeSpent) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Find or create progress
    let progress = await GameProgress.findOne({ userId });
    if (!progress) {
      progress = await GameProgress.create({ userId });
    }

    // Check if task already completed
    if (progress.completedTaskIds.includes(taskId)) {
      return res.status(400).json({ message: 'Task already completed' });
    }

    // Calculate time in minutes
    const timeInMinutes = Math.round(timeSpent / 60);

    // Add to task history
    const taskRecord = {
      date: new Date(),
      module,
      taskType,
      taskId,
      correctRate,
      timeSpent
    };

    // Update progress
    progress.taskHistory.push(taskRecord);
    progress.completedTaskIds.push(taskId);
    progress.totalTime += timeInMinutes;
    progress.moduleBreakdown[`module${module}`] += timeInMinutes;

    // Update daily history
    let todayHistory = progress.dailyTaskHistory.find(h => h.date === today);
    if (!todayHistory) {
      todayHistory = {
        date: today,
        completedCount: 0,
        totalCount: 4,
        totalTime: 0
      };
      progress.dailyTaskHistory.push(todayHistory);
    }

    const historyIndex = progress.dailyTaskHistory.findIndex(h => h.date === today);
    if (historyIndex !== -1) {
      progress.dailyTaskHistory[historyIndex].completedCount += 1;
      progress.dailyTaskHistory[historyIndex].totalTime += timeSpent;
    }

    await progress.save();

    // Calculate today's completed count
    const todayCompleted = progress.completedTaskIds.filter(id => id.startsWith(today)).length;
    const allCompleted = todayCompleted >= 4;

    res.json({
      message: 'Task completed',
      correctRate,
      timeSpent,
      progress: {
        todayCompleted,
        todayTotal: 4,
        allCompleted,
        totalTime: progress.totalTime,
        loginStreak: progress.loginStreak
      }
    });
  } catch (error) {
    console.error('Submit task error:', error);
    res.status(500).json({ message: 'Error submitting task' });
  }
});

// @route   GET /api/game/progress
// @desc    Get user's learning progress statistics
// @access  Private
router.get('/progress', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const today = getDateString();
    const progress = await GameProgress.findOne({ userId });

    if (!progress) {
      return res.json({
        totalTime: 0,
        loginFrequency: 0,
        loginStreak: 0,
        moduleBreakdown: {
          module1: 0,
          module2: 0,
          module3: 0,
          module4: 0
        },
        weeklyStats: [],
        recentTasks: [],
        todayCompleted: 0,
        todayTotal: 4
      });
    }

    // Calculate weekly stats (last 7 days)
    const weeklyStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayTasks = progress.taskHistory.filter(t => {
        const taskDate = new Date(t.date).toISOString().split('T')[0];
        return taskDate === dateStr;
      });

      const dayTime = dayTasks.reduce((sum, t) => sum + t.timeSpent, 0);

      weeklyStats.push({
        date: dateStr,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        timeSpent: Math.round(dayTime / 60), // in minutes
        tasksCompleted: dayTasks.length
      });
    }

    // Get recent tasks (last 10)
    const recentTasks = progress.taskHistory
      .slice(-10)
      .reverse()
      .map(task => ({
        date: task.date,
        module: task.module,
        taskType: task.taskType,
        correctRate: task.correctRate,
        timeSpent: task.timeSpent
      }));

    // Calculate module stats
    const moduleStats = {};
    for (let i = 1; i <= 4; i++) {
      const moduleTasks = progress.taskHistory.filter(t => t.module === i);
      if (moduleTasks.length > 0) {
        const avgCorrectRate = moduleTasks.reduce((sum, t) => sum + t.correctRate, 0) / moduleTasks.length;
        moduleStats[`module${i}`] = {
          time: progress.moduleBreakdown[`module${i}`],
          taskCount: moduleTasks.length,
          avgCorrectRate: Math.round(avgCorrectRate * 100)
        };
      } else {
        moduleStats[`module${i}`] = {
          time: 0,
          taskCount: 0,
          avgCorrectRate: 0
        };
      }
    }

    // Today's completed tasks
    const todayCompleted = progress.completedTaskIds.filter(id => id.startsWith(today)).length;

    res.json({
      totalTime: progress.totalTime,
      loginFrequency: progress.loginFrequency,
      loginStreak: progress.loginStreak,
      moduleBreakdown: progress.moduleBreakdown,
      moduleStats,
      weeklyStats,
      recentTasks,
      completedTasksCount: progress.completedTaskIds.length,
      todayCompleted,
      todayTotal: 4
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ message: 'Error fetching progress' });
  }
});

module.exports = router;
