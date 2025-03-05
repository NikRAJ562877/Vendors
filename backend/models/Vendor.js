const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
  vendorId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'vendor' } // defaults to vendor
});

module.exports = mongoose.model('Vendor', VendorSchema);
