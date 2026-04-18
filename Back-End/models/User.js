const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fname: {
        type: Stirng,
        required: true,
        trim: true
    },
    lname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'customer'],
        default: 'customer '
    }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);