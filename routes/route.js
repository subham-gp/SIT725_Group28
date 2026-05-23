const express = require('express');
const router = express.Router();
const authController = require('../controllers/controller');

router.post('/login', authController.login);

module.exports = router;