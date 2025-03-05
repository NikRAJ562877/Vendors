const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Vendor = require('../models/Vendor');
const bcrypt = require('bcryptjs');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { vendorId, password } = req.body; // Note: no role is sent now
  console.log("Login attempt:", { vendorId, password });
  
  try {
    // First, try to find an admin with the given vendorId (as adminId)
    let user = await Admin.findOne({ adminId: vendorId });
    if (user) {
      // Admin password is hashed using bcrypt
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log("Password mismatch for admin:", vendorId);
        return res.status(400).json({ error: 'Invalid credentials' });
      }
      console.log("Login successful for admin:", vendorId);
      return res.json({ 
        message: 'Login successful', 
        user: { vendorId: user.adminId, role: 'admin' }
      });
    }
    
    // If no admin is found, try to find a vendor
    user = await Vendor.findOne({ vendorId });
    if (!user) {
      console.log("Vendor not found for vendorId:", vendorId);
      return res.status(404).json({ error: 'User not found' });
    }
    
    // For vendors, compare plain text (for development)
    if (password !== user.password) {
      console.log("Password mismatch for vendor:", vendorId);
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    console.log("Login successful for vendor:", vendorId);
    return res.json({ 
      message: 'Login successful', 
      user: { vendorId: user.vendorId, role: 'vendor' }
    });
    
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
