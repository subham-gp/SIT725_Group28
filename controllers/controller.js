const User = require('../models/user');
const mongoose = require('mongoose');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // ensure fields aren't blank
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please enter both email and password.' });
        }

        // Look up the user by email in MongoDB
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        // Utilize the bcrypt method to check password 
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            user: { id: user._id, username: user.username || 'Student' }
        });

    } catch (error) {
        console.error("Backend login error:", error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};


//registration -SG
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        //ensuring all fields are provided
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please fill in all fields.' });
        }

        //checking for existing user
        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return res.status(400).json({ success: false, messsage: 'An Account with this email already exists.' });
        }

        //create and save the new user
        const newUser = new User({
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password: password
        });

        await newUser.save();

        //returning success along with user data for local storage session
        return res.status(201).json({
            success: true,
            message: 'Registration Successful!',
            user: { id: newUser._id, username: newUser.username }
        });

    } catch (error) {
        console.error("!Backend Registration error!:", error);
        return res.status(500).json({ success: false, message: '!Internal Server Error!' });
    }
};