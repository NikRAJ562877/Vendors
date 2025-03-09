const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  category: { type: String, required: true }, // e.g., CERAMIC, PPF
  items: [
    {
      partNo: String,
      productName: String,
      quantity: Number,
      amount: Number,
    },
  ],
  totalAmount: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Report", reportSchema);
