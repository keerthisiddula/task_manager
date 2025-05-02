import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddTask = async () => {
    if (!taskName || !description || !deadline) {
      setMessage('Please fill in all fields');
      return;
    }

    const taskData = { task: taskName, description, deadline, completed: false };
    try {
      const result = await axios.post('http://localhost:5000/tasks', taskData);

      setMessage('Task added successfully ✅');
      setTaskName('');
      setDescription('');
      setDeadline('');
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
      setMessage('Failed to add task ❌');
    }
  };

  // Toggle completed status
  const toggleCompletion = async (id, currentStatus) => {
    try {
      await axios.put(`http://localhost:5000/tasks/${id}`, { completed: !currentStatus });
      fetchTasks();
    } catch (error) {
      console.error('Error updating completion status:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="container">
      <h1>Task Manager</h1>
      <input
        type="text"
        placeholder="Enter Task Name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />
      <textarea
        placeholder="Enter Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />
      <button onClick={handleAddTask}>Add Task</button>

      {message && <p style={{ color: 'green' }}>{message}</p>}

      <h2>Tasks</h2>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            <strong>{task.task}</strong>
            <p>{task.description}</p>
            <p><strong>Deadline:</strong> {task.deadline}</p>
            <p><strong>Status:</strong> {task.completed ? 'Completed' : 'Pending'}</p>

            {/* Toggle button based on task completion status */}
            <button onClick={() => toggleCompletion(task._id, task.completed)}>
              {task.completed ? 'Mark as Undone' : 'Mark as Done'}
            </button>

            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
