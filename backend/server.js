const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');
const { closeExpiredAuctions } = require('./controllers/auctionController');

const app = express();

// Middleware
app.use(express.json());
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  ...(process.env.FRONTEND_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
];

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS origin not allowed: ${origin}`));
  },
}));

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

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  setInterval(() => {
    closeExpiredAuctions().catch((err) => {
      console.error("Close expired auctions error:", err);
    });
  }, 10000);
};

startServer().catch((err) => {
  console.error('Server startup failed:', err);
  process.exit(1);
});
