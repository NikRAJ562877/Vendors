const express = require('express');
const Invoice = require('../models/Invoice');
const router = express.Router();

// Fetch all invoices for Admin
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.status(200).json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

module.exports = router;
