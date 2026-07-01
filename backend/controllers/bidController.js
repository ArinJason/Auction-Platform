const Bid = require("../models/Bid");
const Auction = require("../models/Auction");

// Place Bid
const placeBid = async (req, res) => {
  try {
    const auction = await Auction.findById(
      req.params.auctionId
    );

    if (!auction) {
      return res.status(404).json({
        message: "Auction not found",
      });
    }

    const amount = Number(req.body.amount);

    if (
      amount <= auction.currentHighestBid
    ) {
      return res.status(400).json({
        message:
          "Bid must be higher than current highest bid",
      });
    }

    const bid = await Bid.create({
      auctionId: auction._id,
      bidder: req.user.id,
      amount,
    });

    auction.currentHighestBid = amount;

    await auction.save();

    res.status(201).json(bid);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// User Bid History
const getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({
      bidder: req.user.id,
    })
      .populate("auctionId");

    res.json(bids);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  placeBid,
  getMyBids,
};