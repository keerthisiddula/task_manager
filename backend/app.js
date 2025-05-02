const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const Task = require('./taskModel');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/taskmanager', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

