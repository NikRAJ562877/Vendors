const express = require('express');
const router = express.Router();
const VendorOrder = require('../models/VendorOrder');
const OrderSchema =require('../models/Order')
// POST /api/vendorOrders/:vendorId/orders
// Send orders to a specific vendor
router.post('/:vendorId/orders', async (req, res) => {
  const { vendorId } = req.params;
  const ordersToSend = req.body; // Expecting an array of order objects

  if (!Array.isArray(ordersToSend) || ordersToSend.length === 0) {
    return res.status(400).json({ error: "Orders must be a non-empty array" });
  }

  try {
    // Check if an entry already exists for the vendor
    let vendorOrdersDoc = await OrderSchema.findOne({ vendorId });

    if (vendorOrdersDoc) {
      // Append new orders to the existing array
      vendorOrdersDoc.orders.push(...ordersToSend);
      await vendorOrdersDoc.save();
    } else {
      // Create a new entry for the vendor with these orders
      vendorOrdersDoc = new VendorOrder({ vendorId, orders: ordersToSend });
      await vendorOrdersDoc.save();
    }

    res.json({ message: "Orders sent successfully", vendorOrders: vendorOrdersDoc });

  } catch (err) {
    console.error("Error processing vendor orders:", err);
    res.status(500).json({ error: err.message });
  }
});
router.get('/:vendorId/getOrderDtls', async (req, res) => { 
  try {
    const { vendorId } = req.params;
    console.log("Fetching orders for vendorId:", vendorId); // Debugging log
    const orders = await OrderSchema.find({ VendorsId: String(vendorId) });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this vendor." });
    }

    res.status(200).json({ orders }); // Wrap in an object
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
