const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  type: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
  period: { type: String }, // e.g., 'morning', 'afternoon', 'evening', 'fitness', 'skills', etc.
  text: { type: String, required: true },
  points: { type: Number, default: 0 },
  category: { type: String },
  default: { type: Boolean, default: false }, // true for built-in goals
});

module.exports = mongoose.model('Goal', GoalSchema);
