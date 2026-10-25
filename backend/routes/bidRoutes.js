const express = require('express');
const router = express.Router();
const { placeBid, getBidsForAuction, getUserBids } = require('../controllers/bidController');
const authMiddleware = require('../middleware/authMiddleware');

// Place a bid (requires login)
router.post('/', authMiddleware, placeBid);

// Get all bids for a specific auction
router.get('/auction/:auctionId', getBidsForAuction);

// Get all bids placed by the logged-in user
router.get('/user', authMiddleware, getUserBids);

module.exports = router;
