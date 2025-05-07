const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const Task = require('./taskModel');
const path = require('path');  // moved up

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/taskmanager', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ✅ API routes
app.get('/', (req, res) => {
  res.send('Task Manager API is running');
});

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  const { task, description, deadline } = req.body;
  const newTask = new Task({ task, description, deadline });
  await newTask.save();
  res.json(newTask);
});

app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const task = await Task.findByIdAndUpdate(id, updates, { new: true });
  res.json(task);
});

app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  await Task.findByIdAndDelete(id);
  res.json({ message: 'Task deleted successfully' });
});

// ✅ Serve React static files **after** routes
app.use(express.static(path.join(__dirname, '../frontend/my-app/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/my-app/build/index.html'));
});

// ✅ Start server at the very end
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
