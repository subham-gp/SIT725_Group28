const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    // Links task to the user who created it
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Task must belong to a user']
    },

    title: {
        type: String,
        required: [true, 'Task title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },

    //added Course -SG
    course: {
        type: String,
        trim: true,
        maxlength: [50, 'Course name cannot exceed 50 Characters'],
        default: 'General'
    },

    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },

    dueDate: {
        type: Date,
        required: [true, 'Due date is required']
    },

    status: {
        type: String,
        enum: ['todo', 'in-progress', 'done'],
        default: 'todo'
    },

    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    }

}, { timestamps: true });
module.exports = mongoose.model('Task', TaskSchema);