const Task = require('../models/task');

//create new task -SG
exports.createTask = async (req, res) => {
    try {
        const { title, description, dueDate, priority, course, user } = req.body;

        if (!title || !dueDate || !user) {
            return res.status(400).json({ success: false, message: 'Title, Due Date and User ID are required' });
        }

        const newTask = new Task({
            user,
            title: title.trim(),
            course: course ? course.trim() : 'General',
            description: description ? description.trim() : '',
            dueDate: new Date(dueDate),
            priority: priority || 'medium',
            status: 'todo'
        });

        await newTask.save();

        return res.status(201).json({
            success: true,
            message: 'task created successfully',
            task: newTask
        });
    } catch (error) {
        console.error("Backend Task Creation Error:", error);
        return res.status(500).json({ success: false, message: 'Internal Server Error Creating Task' });
    }
};

//fetching specific user tasks -SG
exports.getTasks = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ success: false, message: 'UserID missing' });
        }

        //finding task and sorting with closest deasline first
        const userTasks = await Task.find({ user: userId }).sort({ dueDate: 1 });

        return res.status(200).json({
            success: true,
            tasks: userTasks
        });
    } catch (error) {
        console.error("Backend Fetch Task Error:", error);
        return res.status(500).json({ success: false, message: 'Internal Server Error Fetching Task' });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, course, description, dueDate, priority, status } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: 'Task ID is required' });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            {
                title: title?.trim(),
                course: course ? course.trim() : 'General',
                description: description ? description.trim() : '',
                dueDate: dueDate ? new Date(dueDate) : undefined,
                priority,
                status
            },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            task: updatedTask});
       } catch (error) {
        console.error("Backend Task Update Error:", error);
        return res.status(500).json({ success: false, message: 'Internal Server Error Updating Task' });
    }
};