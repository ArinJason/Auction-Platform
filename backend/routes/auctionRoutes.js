const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createAuction,
  getAuctions,
} = require("../controllers/auctionController");

// Create Auction
router.post("/", protect, createAuction);

// Get All Auctions
router.get("/", getAuctions);

module.exports = router;