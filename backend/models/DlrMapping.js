const mongoose = require("mongoose");

const dlrMappingSchema = new mongoose.Schema({
  vendorId: { type: String, required: true},  // Vendor ID remains unique
  dlrCodes: { type: String, required: true }// Array of DLR codes
});

module.exports = mongoose.model("DlrMapping", dlrMappingSchema);
