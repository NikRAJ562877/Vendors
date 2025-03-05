const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true },
  customerName: { type: String },
  date: { type: Date },
  amount: { type: Number }
});

module.exports = mongoose.model('Order', OrderSchema);
