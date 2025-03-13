const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  invoiceNo: { type: String, required: true },
  date: { type: String, required: true },
  month: { type: String, required: true },
  amount: { type: Number, required: true },
  vendorId: { type: String, required: true },
  fileName: { type: String, required: true },
  supportDocName: { type: String } // ✅ Optional field for extra documents
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
