const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    path: {
        type: String,
        required: true,
        trim: true,
    }

}, { timestamps: true });

module.exports =File= mongoose.model('File', fileSchema);