const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');

// Get all goals (optionally by type)
router.get('/', goalController.getGoals);
// Add a new goal
router.post('/', goalController.addGoal);
// Remove a goal
router.delete('/:id', goalController.removeGoal);
// Update a goal
router.put('/:id', goalController.updateGoal);

module.exports = router;
