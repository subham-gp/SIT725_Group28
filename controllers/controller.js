const User = require('../models/user');

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