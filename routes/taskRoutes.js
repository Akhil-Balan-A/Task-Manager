const express = require('express');
const taskRoute = express.Router();
const taskController = require('../controllers/taskController');

taskRoute.get('/', taskController.getTasks); // Get tasks (with optional search)

taskRoute.post('/tasks', taskController.createTask); // Create a new task


// Route to update task status
taskRoute.put('/tasks/:id/status', taskController.updateTaskStatus);

// Route to delete a task
taskRoute.delete('/tasks/:id', taskController.deleteTask);

//Route to display the edit form
taskRoute.get('/tasks/edit/:id',taskController.getEditTask);

//Route to handle the edit form submission (update task description)
taskRoute.put('/tasks/:id/description',taskController.updateTaskDescription);

module.exports = taskRoute;
