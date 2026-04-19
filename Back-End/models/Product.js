const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    desc: {
        type: String,
        required: true,
        trim: true
    },
    madeIn: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    fileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
    },
}, { timestamps: true });

module.exports = Product = mongoose.model('Product', productSchema);