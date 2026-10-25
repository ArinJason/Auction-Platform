const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Auction = require('../models/Auction'); // assuming you track earnings via auctions/bids

// Earnings overview
router.get('/earnings', authMiddleware, async (req, res) => {
  try {
    // Example: sum of winning bids for seller’s closed auctions
    const total = await Auction.aggregate([
      { $match: { sellerId: req.user._id, status: 'closed' } },
      { $group: { _id: null, total: { $sum: "$highestBid" } } }
    ]);

    res.json({
      monthly: null,
      total: total[0]?.total || 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Performance stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    res.json({
      views: null,
      bids: null,
      conversion: null
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
