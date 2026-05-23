const express = require('express');
const router = express.Router();
const authController = require('../controllers/controller');

router.post('/login', authController.login);
router.post('/register', authController.register);  //SG

module.exports = router;