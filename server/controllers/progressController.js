const Progress = require('../models/Progress');
const dayjs = require('dayjs');

// Get all progress history and calculate streak
exports.getProgress = async (req, res) => {
  try {
    const allProgress = await Progress.find({}).sort({ date: -1 }).lean();
    // Calculate streak: count consecutive days with points > 0
    let streak = 0;
    let today = dayjs().startOf('day');
    for (let i = 0; i < allProgress.length; i++) {
      const entry = allProgress[i];
      const entryDate = dayjs(entry.date);
      if (entry.points > 0 && entryDate.isSame(today, 'day')) {
        streak++;
        today = today.subtract(1, 'day');
      } else if (entry.points > 0 && entryDate.isSame(today.subtract(streak, 'day'), 'day')) {
        streak++;
        today = today.subtract(1, 'day');
      } else {
        break;
      }
    }
    res.json({ history: allProgress, streak });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load progress history' });
  }
};

// Save progress for a specific date
exports.saveProgress = async (req, res) => {
  try {
    let { completedTasks, points, date } = req.body;
    if (!date) return res.status(400).json({ error: 'Date is required' });
    // Normalize date to YYYY-MM-DD
    const dayjsDate = dayjs(date);
    if (!dayjsDate.isValid()) return res.status(400).json({ error: 'Invalid date format' });
    date = dayjsDate.format('YYYY-MM-DD');
    let progress = await Progress.findOne({ date });
    if (!progress) {
      progress = await Progress.create({ date, completedTasks, points });
    } else {
      progress.completedTasks = completedTasks;
      progress.points = points;
      await progress.save();
    }
    res.json({ completedTasks, points, date });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save progress' });
  }
};

// Get weekly and monthly progress
exports.getWeeklyMonthlyProgress = async (req, res) => {
  try {
    // For now, just get the latest progress doc (single user)
    const latest = await Progress.findOne({}).sort({ date: -1 }).lean();
    res.json({
      weekly: latest?.weekly || {},
      monthly: latest?.monthly || {}
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load weekly/monthly progress' });
  }
};

// Save weekly and monthly progress
exports.saveWeeklyMonthlyProgress = async (req, res) => {
  try {
    const { weekly, monthly } = req.body;
    // For now, update the latest progress doc (single user)
    let latest = await Progress.findOne({}).sort({ date: -1 });
    if (!latest) {
      latest = await Progress.create({ date: new Date().toISOString().slice(0,10), completedTasks: [], points: 0 });
    }
    if (weekly) latest.weekly = weekly;
    if (monthly) latest.monthly = monthly;
    await latest.save();
    res.json({ weekly: latest.weekly, monthly: latest.monthly });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save weekly/monthly progress' });
  }
};
