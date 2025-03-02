// backend/models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true },
  customerName: { type: String },
  date: { type: Date },
  amount: { type: Number },
  // add other fields as needed based on your Excel data
});

module.exports = mongoose.model('Order', OrderSchema);
