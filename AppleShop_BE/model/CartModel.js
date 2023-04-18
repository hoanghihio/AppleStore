const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, required: true },
  quantity: { type: Number, required: true, default: 1 },
});

const CartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  items: [CartItemSchema],
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Cart', CartSchema);
