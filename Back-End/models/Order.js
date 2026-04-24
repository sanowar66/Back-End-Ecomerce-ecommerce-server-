const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    qty: {
        type: Number,
        required: true,
        min: 1,
    },
    total: {
        type: Number,
        required: true,
        min: 1,
    },
    purchaseDate: {
        type: Date,
        default: Date.now,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    deliveryDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['in-progress', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },
}, { timestamps: true });

module.exports =Order= mongoose.model('Order', orderSchema);