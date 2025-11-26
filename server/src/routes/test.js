const express = require('express');
const router = express.Router();
const TestScore = require('../models/TestScore');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// @route   POST /api/test/submit
// @desc    Submit test scores (admin only)
// @access  Private (Admin only)
router.post('/submit', protect, adminOnly, async (req, res) => {
  try {
    const { studentId, testType, scores } = req.body;

    // Validate test type
    if (!['pre', 'post', 'delayed'].includes(testType)) {
      return res.status(400).json({ message: 'Invalid test type' });
    }

    // Find user by studentId
    const user = await User.findOne({ studentId });
    if (!user) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if test score already exists
    const existingScore = await TestScore.findOne({
      userId: user._id,
      testType
    });

    if (existingScore) {
      // Update existing score
      existingScore.scores = scores;
      existingScore.completedAt = new Date();
      await existingScore.save();

      return res.json({
        message: 'Test score updated successfully',
        testScore: existingScore
      });
    }

    // Create new test score
    const testScore = await TestScore.create({
      userId: user._id,
      testType,
      scores,
      completedAt: new Date()
    });

    res.status(201).json({
      message: 'Test score submitted successfully',
      testScore
    });
  } catch (error) {
    console.error('Submit test error:', error);
    res.status(500).json({ message: 'Error submitting test score' });
  }
});

// @route   GET /api/test/scores/:userId
// @desc    Get all test scores for a user
// @access  Private
router.get('/scores/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params;

    // Check authorization (users can only view their own scores unless admin)
    if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view these scores' });
    }

    const scores = await TestScore.find({ userId }).sort({ completedAt: 1 });

    // Format response
    const formattedScores = {
      pre: null,
      post: null,
      delayed: null
    };

    scores.forEach(score => {
      formattedScores[score.testType] = {
        scores: score.scores,
        completedAt: score.completedAt
      };
    });

    res.json(formattedScores);
  } catch (error) {
    console.error('Get scores error:', error);
    res.status(500).json({ message: 'Error fetching test scores' });
  }
});

// @route   GET /api/test/my-scores
// @desc    Get current user's test scores
// @access  Private
router.get('/my-scores', protect, async (req, res) => {
  try {
    const scores = await TestScore.find({ userId: req.user._id }).sort({ completedAt: 1 });

    const formattedScores = {
      pre: null,
      post: null,
      delayed: null
    };

    scores.forEach(score => {
      formattedScores[score.testType] = {
        scores: score.scores,
        completedAt: score.completedAt
      };
    });

    res.json(formattedScores);
  } catch (error) {
    console.error('Get my scores error:', error);
    res.status(500).json({ message: 'Error fetching test scores' });
  }
});

module.exports = router;
