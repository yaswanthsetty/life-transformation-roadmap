const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  completedTasks: [String],
  points: { type: Number, default: 0 },
  weekly: {
    // weekKey: { fitness: [Boolean], skills: [Boolean], lifestyle: [Boolean] }
    type: Map,
    of: {
      fitness: [Boolean],
      skills: [Boolean],
      lifestyle: [Boolean]
    },
    default: {}
  },
  monthly: {
    // monthKey: { fitness: Boolean, skills: Boolean, lifestyle: Boolean }
    type: Map,
    of: {
      fitness: Boolean,
      skills: Boolean,
      lifestyle: Boolean
    },
    default: {}
  }
});

module.exports = mongoose.model('Progress', ProgressSchema);
