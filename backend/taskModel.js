const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: Date, required: true },
  completed: { type: Boolean, default: false }  // ✅ add this
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;