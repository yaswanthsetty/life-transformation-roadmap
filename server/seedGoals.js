// seedGoals.js
// Script to seed the database with default daily, weekly, and monthly goals

const mongoose = require('mongoose');
const Goal = require('./models/Goal');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/life-transformation';

const defaultGoals = [
  // Daily Goals
  {
    text: 'Drink 8 glasses of water',
    type: 'daily',
    default: true,
  },
  {
    text: 'Exercise for 30 minutes',
    type: 'daily',
    default: true,
  },
  {
    text: 'Read for 20 minutes',
    type: 'daily',
    default: true,
  },
  // Weekly Goals
  {
    text: 'Complete 3 workout sessions',
    type: 'weekly',
    default: true,
  },
  {
    text: 'Meal prep for the week',
    type: 'weekly',
    default: true,
  },
  // Monthly Goals
  {
    text: 'Finish one book',
    type: 'monthly',
    default: true,
  },
  {
    text: 'Review monthly budget',
    type: 'monthly',
    default: true,
  },
];

async function seedGoals() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Only insert if no goals exist
    const count = await Goal.countDocuments();
    if (count === 0) {
      await Goal.insertMany(defaultGoals);
      console.log('Default goals seeded!');
    } else {
      console.log('Goals already exist, skipping seeding.');
    }
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedGoals();
