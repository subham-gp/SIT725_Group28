const express = require('express');
const router = express.Router();
const authController = require('../controllers/controller');
const taskController = require('../controllers/taskController');

//Authentication endpoints
router.post('/login', authController.login);
router.post('/register', authController.register);  //SG

//task management endpoints -SG
router.post('/tasks/create', taskController.createTask);
router.get('/tasks', taskController.getTasks);


//Delete 
router.delete('/tasks/:id', taskController.deleteTask);
module.exports = router;
