const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  dlrCode: { type: String, alias: "DLRCODE" },
  dlrName: { type: String, alias: "DLRNAME" },
  partNo: { type: String, alias: "Part no." },
  qty: { type: String, alias: "Qty" },
  orderNo: { type: String, alias: "Order no." },
  po: { type: String, alias: "PO" },
  VendorsId:{type: String, alias: "Vendors_id",required: true},
});

module.exports = mongoose.model("Order", OrderSchema);
