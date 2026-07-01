const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  placeBid,
  getMyBids,
} = require("../controllers/bidController");

// Place Bid
router.post("/:auctionId", protect, placeBid);

// Logged-in User Bid History
router.get("/my-bids", protect, getMyBids);

module.exports = router;