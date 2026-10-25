const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createAuction,
  getAuctions,
  getAuctionById,
  closeAuction,
  cancelAuction,
  activateAuction,
  getSellerAuctions // added in controller
} = require('../controllers/auctionController');

// Create auction
router.post('/', authMiddleware, createAuction);

// Get all auctions
router.get('/', getAuctions);

// Get auctions for logged-in seller (dashboard)
router.get('/seller', authMiddleware, getSellerAuctions);

// Get auction by ID
router.get('/:id', getAuctionById);

// Close auction
router.put('/:id/close', authMiddleware, closeAuction);

// Cancel auction
router.put('/:id/cancel', authMiddleware, cancelAuction);

// Activate auction
router.put('/:id/activate', authMiddleware, activateAuction);

module.exports = router;
