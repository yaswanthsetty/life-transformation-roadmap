const Goal = require('../models/Goal');

// Get all goals (optionally by type)
exports.getGoals = async (req, res) => {
  try {
    const { type } = req.query;
    const query = type ? { type } : {};
    const goals = await Goal.find(query).lean();
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load goals' });
  }
};

// Add a new goal
exports.addGoal = async (req, res) => {
  try {
    const { type, period, text, points, category } = req.body;
    const goal = await Goal.create({ type, period, text, points, category, default: false });
    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add goal' });
  }
};

// Remove a goal
exports.removeGoal = async (req, res) => {
  try {
    const { id } = req.params;
    await Goal.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove goal' });
  }
};

// Update a goal
exports.updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, points, category, period } = req.body;
    const goal = await Goal.findByIdAndUpdate(id, { text, points, category, period }, { new: true });
    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update goal' });
  }
};
