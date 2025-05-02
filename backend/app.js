require('dotenv').config({ path: './backend/.env' });  // Explicitly specify the path to the .env file
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const Task = require('./taskModel');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI;  // Ensure this is set in your environment variables
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.get('/', (req, res) => {
  res.send('Task Manager API is running');
});

// ✅ Get all tasks
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// ✅ Add new task
app.post('/tasks', async (req, res) => {
  const { task, description, deadline } = req.body;
  const newTask = new Task({ task, description, deadline });
  await newTask.save();
  res.json(newTask);
});

// ✅ Update task (priority and/or completed)
app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;  // can contain priority or completed
  const task = await Task.findByIdAndUpdate(id, updates, { new: true });
  res.json(task);
});

// ✅ Delete task
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  await Task.findByIdAndDelete(id);
  res.json({ message: 'Task deleted successfully' });
});

// Start server on dynamic port
const PORT = process.env.PORT || 5000;  // Default to 5000 if PORT is not set in environment
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
