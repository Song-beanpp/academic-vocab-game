const express = require('express');
const router = express.Router();
const { Parser } = require('json2csv');
const User = require('../models/User');
const GameProgress = require('../models/GameProgress');
const TestScore = require('../models/TestScore');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/admin/students
// @desc    Get all students list
// @access  Private (Admin only)
router.get('/students', protect, adminOnly, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 });

    // Get progress for each student
    const studentsWithProgress = await Promise.all(
      students.map(async (student) => {
        const progress = await GameProgress.findOne({ userId: student._id });
        const testScores = await TestScore.find({ userId: student._id });

        return {
          _id: student._id,
          studentId: student.studentId,
          name: student.name,
          email: student.email,
          group: student.group,
          createdAt: student.createdAt,
          totalTime: progress?.totalTime || 0,
          loginFrequency: progress?.loginFrequency || 0,
          tasksCompleted: progress?.taskHistory?.length || 0,
          hasPreTest: testScores.some(t => t.testType === 'pre'),
          hasPostTest: testScores.some(t => t.testType === 'post'),
          hasDelayedTest: testScores.some(t => t.testType === 'delayed')
        };
      })
    );

    res.json(studentsWithProgress);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Error fetching students' });
  }
});

// @route   GET /api/admin/student/:id
// @desc    Get detailed data for a single student
// @access  Private (Admin only)
router.get('/student/:id', protect, adminOnly, async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select('-password');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const progress = await GameProgress.findOne({ userId: student._id });
    const testScores = await TestScore.find({ userId: student._id });

    // Format test scores
    const scores = {
      pre: null,
      post: null,
      delayed: null
    };

    testScores.forEach(score => {
      scores[score.testType] = score.scores;
    });

    res.json({
      student: {
        _id: student._id,
        studentId: student.studentId,
        name: student.name,
        email: student.email,
        group: student.group,
        createdAt: student.createdAt
      },
      progress: {
        totalTime: progress?.totalTime || 0,
        loginFrequency: progress?.loginFrequency || 0,
        streak: progress?.streak || 0,
        moduleBreakdown: progress?.moduleBreakdown || {
          module1: 0,
          module2: 0,
          module3: 0,
          module4: 0
        },
        taskHistory: progress?.taskHistory || [],
        completedTasksCount: progress?.completedTasks?.length || 0
      },
      testScores: scores
    });
  } catch (error) {
    console.error('Get student detail error:', error);
    res.status(500).json({ message: 'Error fetching student data' });
  }
});

// @route   GET /api/admin/export-csv
// @desc    Export all research data as CSV
// @access  Private (Admin only)
router.get('/export-csv', protect, adminOnly, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });

    const exportData = await Promise.all(
      students.map(async (student) => {
        const progress = await GameProgress.findOne({ userId: student._id });
        const testScores = await TestScore.find({ userId: student._id });

        // Format test scores
        const preTest = testScores.find(t => t.testType === 'pre');
        const postTest = testScores.find(t => t.testType === 'post');
        const delayedTest = testScores.find(t => t.testType === 'delayed');

        return {
          student_id: student.studentId,
          group: student.group,
          total_time: progress?.totalTime || 0,
          login_freq: progress?.loginFrequency || 0,
          m1_time: progress?.moduleBreakdown?.module1 || 0,
          m2_time: progress?.moduleBreakdown?.module2 || 0,
          m3_time: progress?.moduleBreakdown?.module3 || 0,
          m4_time: progress?.moduleBreakdown?.module4 || 0,
          // Pre-test scores
          pre_vocab: preTest?.scores?.vocabulary || '',
          pre_coll: preTest?.scores?.collocation || '',
          pre_freq: preTest?.scores?.frequency || '',
          pre_div: preTest?.scores?.diversity || '',
          pre_comp: preTest?.scores?.complexity || '',
          pre_hedg: preTest?.scores?.hedging || '',
          pre_cohe: preTest?.scores?.coherence || '',
          // Post-test scores
          post_vocab: postTest?.scores?.vocabulary || '',
          post_coll: postTest?.scores?.collocation || '',
          post_freq: postTest?.scores?.frequency || '',
          post_div: postTest?.scores?.diversity || '',
          post_comp: postTest?.scores?.complexity || '',
          post_hedg: postTest?.scores?.hedging || '',
          post_cohe: postTest?.scores?.coherence || '',
          // Delayed test scores
          delayed_vocab: delayedTest?.scores?.vocabulary || '',
          delayed_coll: delayedTest?.scores?.collocation || '',
          delayed_freq: delayedTest?.scores?.frequency || '',
          delayed_div: delayedTest?.scores?.diversity || '',
          delayed_comp: delayedTest?.scores?.complexity || '',
          delayed_hedg: delayedTest?.scores?.hedging || '',
          delayed_cohe: delayedTest?.scores?.coherence || ''
        };
      })
    );

    // Define CSV fields
    const fields = [
      'student_id', 'group', 'total_time', 'login_freq',
      'm1_time', 'm2_time', 'm3_time', 'm4_time',
      'pre_vocab', 'pre_coll', 'pre_freq', 'pre_div', 'pre_comp', 'pre_hedg', 'pre_cohe',
      'post_vocab', 'post_coll', 'post_freq', 'post_div', 'post_comp', 'post_hedg', 'post_cohe',
      'delayed_vocab', 'delayed_coll', 'delayed_freq', 'delayed_div', 'delayed_comp', 'delayed_hedg', 'delayed_cohe'
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(exportData);

    res.header('Content-Type', 'text/csv');
    res.attachment('research_data_export.csv');
    res.send(csv);
  } catch (error) {
    console.error('Export CSV error:', error);
    res.status(500).json({ message: 'Error exporting data' });
  }
});

// @route   POST /api/admin/create-admin
// @desc    Create an admin user (for initial setup)
// @access  Public (should be disabled in production)
router.post('/create-admin', async (req, res) => {
  try {
    const { studentId, name, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin user already exists' });
    }

    const admin = await User.create({
      studentId,
      name,
      email,
      password,
      group: 'experimental',
      role: 'admin'
    });

    res.status(201).json({
      message: 'Admin user created successfully',
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Error creating admin user' });
  }
});

module.exports = router;
