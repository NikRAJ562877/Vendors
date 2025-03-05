const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');

// POST /api/vendors
router.post('/', async (req, res) => {
  try {
    const { vendorId, password } = req.body; // role is not expected here; defaults to "vendor"
    if (!vendorId || !password) {
      return res.status(400).json({ error: 'Please provide vendorId and password' });
    }
    const existingVendor = await Vendor.findOne({ vendorId });
    if (existingVendor) {
      return res.status(400).json({ error: 'Vendor already exists' });
    }
    console.log("Creating vendor (plain text):", vendorId);
    const newVendor = new Vendor({ vendorId, password, role: 'vendor' });
    await newVendor.save();
    res.json({ message: 'Vendor created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
