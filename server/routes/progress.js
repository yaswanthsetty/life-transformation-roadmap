const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');

// Get user progress
router.get('/', progressController.getProgress);

// Save user progress
router.post('/', progressController.saveProgress);

// Weekly/monthly progress endpoints
router.get('/plans', progressController.getWeeklyMonthlyProgress);
router.post('/plans', progressController.saveWeeklyMonthlyProgress);

module.exports = router;
