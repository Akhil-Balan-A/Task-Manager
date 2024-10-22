const Task = require('../models/taskModel');


// Display tasks.
exports.getTasks = async (req, res) => {
    // Get the current page or set to 1 if not specified
    const page = parseInt(req.query.page) || 1; // Default to page 1
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
        res.redirect('/'); // Redirect to the main page after creating a task
    } catch (error) {
        console.error('Error creating task:', error.message); // Log error to console
        res.status(500).send('Server Error');
    }
};

// Update task status
exports.updateTask = async (req, res) => {
    try {
        await Task.findByIdAndUpdate(req.params.id, { status: req.body.status });
        res.redirect('/');
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
