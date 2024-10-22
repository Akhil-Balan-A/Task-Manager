const Task = require('../models/taskModel');


// Display tasks.
exports.getTasks = async (req, res) => {
    // Get the current page or set to 1 if not specified
    const page = parseInt(req.query.page) || 1; // Default on load
    const limit = 3; // Number of tasks per page
    const skip = (page - 1) * limit; // Number of tasks to skip

    const searchQuery = req.query.search || ""; // Get the search query from request

    try {
        // Build a query based on the search criteria
        const query = searchQuery
            ? { description: { $regex: searchQuery, $options: 'i' } } // Case-insensitive regex search
            : {}; // Empty query to fetch all tasks

        // Count total tasks matching the search criteria
        const totalTasks = await Task.countDocuments(query);
        
        // Fetch tasks for the current page
        const tasks = await Task.find(query).skip(skip).limit(limit);

        // Calculate total pages
        const totalPages = Math.ceil(totalTasks / limit);

        // Render the task view with the fetched tasks and pagination data
        res.render('task', {
            tasks,
            currentPage: page,
            totalPages: totalPages, // Send total pages to the view
            searchQuery // Pass search query to the view to keep it in the input field
        });
    } catch (error) {
        console.error('Error fetching tasks:', error.message); // Log error to console
        res.status(500).send('Server Error');
    }
};

exports.createTask = async (req, res) => {
    try {
        await Task.create({ description: req.body.description });
        res.redirect('/?task_added=true'); // Pass success flag
    } catch (error) {
        console.error('Error creating task:', error.message); // Log error to console
        res.status(500).send('Server Error');
    }
};

exports.updateTaskStatus = async (req, res) => {
    try {
        const taskId = req.params.id; // Get task ID from URL params
        const { status } = req.body; // Get new status from request body
        
        // Ensure status is valid
        if (!['Pending', 'Completed'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        // Update task status in the database
        const updatedTask = await Task.findByIdAndUpdate(taskId, { status }, { new: true });
        
        // Check if task was found and updated
        if (!updatedTask) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        
        // Redirect with success flag
        res.redirect('/?task_updated=true');
    } catch (err) {
        console.error('Error updating task status:', err.message);
        res.status(500).send('Server Error');
    }
};


// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.redirect('/?task_deleted=true'); // Pass success flag for deletion
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.getEditTask = async(req,res)=>{
    try {
        const task = await Task.findById(req.params.id);
        res.render('editTask',{task});
        
    } catch (error) {
        res.status(500).send('server error')
    }
}

// Update task description by ID
exports.updateTaskDescription = async (req, res) => {
    try {
        const { description } = req.body; // Get the new description from the request body
        await Task.findByIdAndUpdate(req.params.id, { description }); // Update the task in the database
        res.status(200).json({ success: true, description }); // Send updated description back to the client
    } catch (error) {
        console.error('Error updating task description:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
