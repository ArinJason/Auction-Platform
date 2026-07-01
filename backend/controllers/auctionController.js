const Auction = require("../models/Auction");

// Create Auction
const createAuction = async (req, res) => {
  try {
    const auction = await Auction.create({
      productId: req.body.productId,
      endTime: req.body.endTime,
    });

    res.status(201).json(auction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Auctions
const getAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find()
      .populate("productId");

    res.json(auctions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAuction,
  getAuctions,
};