const express = require('express');
const router = express.Router();
const User = require('../models/User');
const GameProgress = require('../models/GameProgress');
const generateToken = require('../utils/generateToken');
const { protect } = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { username, studentId, name, email, password, group } = req.body;

    // Check if user already exists
    const checkFields = [{ email }];
    if (username) checkFields.push({ username });
    if (studentId) checkFields.push({ studentId });

    const existingUser = await User.findOne({
      $or: checkFields
    });

    if (existingUser) {
      return res.status(400).json({
        message: existingUser.email === email
          ? 'Email already registered'
          : existingUser.username === username
          ? 'Username already exists'
          : 'Student ID already exists'
      });
    }

    // Create user
    const user = await User.create({
      username,
      studentId,
      name,
      email,
      password,
      group
    });

    // Create initial game progress record
    await GameProgress.create({
      userId: user._id
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      username: user.username,
      studentId: user.studentId,
      name: user.name,
      email: user.email,
      group: user.group,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update login frequency
    const progress = await GameProgress.findOne({ userId: user._id });
    if (progress && progress.isNewLoginDay()) {
      // Check if consecutive day for streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      const lastLoginDay = progress.lastLogin
        ? new Date(progress.lastLogin).setHours(0, 0, 0, 0)
        : 0;

      const isConsecutive = lastLoginDay >= yesterday.getTime();

      await GameProgress.findOneAndUpdate(
        { userId: user._id },
        {
          $inc: {
            loginFrequency: 1,
            streak: isConsecutive ? 1 : -progress.streak + 1
          },
          $set: { lastLogin: new Date() }
        }
      );
    } else if (progress) {
      await GameProgress.findOneAndUpdate(
        { userId: user._id },
        { $set: { lastLogin: new Date() } }
      );
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      username: user.username,
      studentId: user.studentId,
      name: user.name,
      email: user.email,
      group: user.group,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const progress = await GameProgress.findOne({ userId: req.user._id });

    res.json({
      _id: user._id,
      username: user.username,
      studentId: user.studentId,
      name: user.name,
      email: user.email,
      group: user.group,
      role: user.role,
      streak: progress?.streak || 0,
      loginFrequency: progress?.loginFrequency || 0
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
