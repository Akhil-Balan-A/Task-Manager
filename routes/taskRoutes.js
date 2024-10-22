const express = require('express');
const taskRoute = express.Router();
const taskController = require('../controllers/taskController');

taskRoute.get('/', taskController.getTasks); // Get tasks (with optional search)
taskRoute.post('/tasks', taskController.createTask); // Create a new task

// Route to update task status
taskRoute.put('/tasks/:id', taskController.updateTask);

// Route to delete a task
taskRoute.delete('/tasks/:id', taskController.deleteTask);

module.exports = taskRoute;
