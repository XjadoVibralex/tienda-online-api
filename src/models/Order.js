const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
});

const orderSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    address: { type: String, required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    orderStatus: {
        type: String,
        enum: ['processing', 'shipped', 'delivered', 'canceled'],
        default: 'processing'
    },
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
}, { timestamps: true });
module.exports = mongoose.model('Order', orderSchema);