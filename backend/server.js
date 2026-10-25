const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');   // import mongoose
const connectDB = require('./config/db');
const { closeExpiredAuctions } = require('./controllers/auctionController');

dotenv.config({ path: path.join(__dirname, '.env') });
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/auctions', require('./routes/auctionRoutes')); // <-- auction routes
app.use('/api/bids', require('./routes/bidRoutes'));
app.use("/uploads", express.static("uploads"));
app.use('/api/sales', require('./routes/salesRoutes'));     //  new
app.use('/api/messages', require('./routes/messageRoutes')); // new
// Root test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

setInterval(() => {
  closeExpiredAuctions().catch((err) => {
    console.error("Close expired auctions error:", err);
  });
}, 10000);
