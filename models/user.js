const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    username: {
        type: String,
        trim: true
    }
}, { timestamps: true });

// PASSWORD HASHING
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10); //10 salt rounds
        this.password = await bcrypt.hash(this.password, salt); // Hashes password + salt
    } catch (err) {
        throw err;      //changed the next() -SG
    }
});


UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);