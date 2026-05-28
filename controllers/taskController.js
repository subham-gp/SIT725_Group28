const Task = require('../models/task');
const mongoose = require('mongoose');

// CREATE TASK
exports.createTask = async (req, res) => {
  try {
    const { user, title, course, description, dueDate, priority } = req.body;

    if (!user || !title || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'User, title and due date are required.'
      });
    }

    const newTask = new Task({
      user,
      title,
      course,
      description,
      dueDate,
      priority,
      status: 'todo'
    });

    await newTask.save();

    return res.status(201).json({
      success: true,
      message: 'Task created successfully.',
      task: newTask
    });

  } catch (error) {
    console.error('Create task error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};

// GET TASKS
exports.getTasks = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required.'
      });
    }

    const tasks = await Task.find({ user: userId }).sort({ dueDate: 1 });

    return res.status(200).json({
      success: true,
      tasks
    });

  } catch (error) {
    console.error('Get tasks error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};

// DELETE TASK
exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID.'
      });
    }

    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully.'
    });

  } catch (error) {
    console.error('Delete task error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};