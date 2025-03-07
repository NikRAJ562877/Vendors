const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  dlrCode: { type: String, required: true },
  zone: { type: String },
  boDlrNo: { type: String },
  partNo: { type: String },
  orderNo: { type: String },
  po: { type: String }
});

module.exports = mongoose.model('Order', OrderSchema);
