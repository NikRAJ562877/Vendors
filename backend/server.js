const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB (ensure your .env contains MONGO_URI)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Import routes
const authRoutes = require('./routes/auth');
const adminsRoutes = require('./routes/admins');  // For creating admin accounts
const vendorsRoutes = require('./routes/vendors');
const ordersRoutes = require('./routes/orders');
const vendorOrdersRoutes = require('./routes/vendorOrders');
const dlrRoutes = require("./routes/dlrRoutes");
const reportsRoutes = require('./routes/reports');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/admins', adminsRoutes);
app.use('/api/vendors', vendorsRoutes);
app.use("/api/order",ordersRoutes)
app.use('/api/vendorOrders', vendorOrdersRoutes);
app.use('/api/reports', reportsRoutes);
app.use("/api/dlr", dlrRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
