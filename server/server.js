// Basic Express server setup
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;

const progressRoutes = require('./routes/progress');
const goalRoutes = require('./routes/goal');
const Progress = require('./models/Progress');

mongoose.connect('mongodb://localhost:27017/lifeapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());
app.use('/api/progress', progressRoutes);
app.use('/api/goals', goalRoutes);

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
