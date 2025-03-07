const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const Order = require('../models/Order');

// Configure multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/orders/upload - Extract and save Excel data
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file provided' });

    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    // Map to extract only the desired fields (adjust keys as per your Excel headers)
    const extractedData = data.map((row) => ({
      dlrCode: row["dlr code/dle code"] || "",
      zone: row["zone"] || "",
      boDlrNo: row["BO dlr no./BO"] || "",
      partNo: row["Part no."] || "",
      orderNo: row["order no./ New order no."] || "",
      po: row["PO"] || ""
    }));

    // Save extracted data into the database
    const insertedOrders = await Order.insertMany(extractedData);
    res.json({ data: insertedOrders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET /api/orders - Retrieve all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/orders - Create a new order
router.post('/', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.json(savedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/orders/:id - Update an order
router.put('/:id', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/orders/:id - Delete an order
router.delete('/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
