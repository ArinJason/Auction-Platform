const Bid = require('../models/Bid');
const Auction = require('../models/Auction');

// Place a new bid
exports.placeBid = async (req, res) => {
  try {
    const { auctionId, bidAmount } = req.body;
    const userId = req.user._id; // comes from authMiddleware

    // Check auction exists
    const auction = await Auction.findById(auctionId);
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    // Check auction is active
    if (auction.status !== "active") {
      return res.status(400).json({ message: "Auction is not active" });
    }

    // Check against current highest bid
    const highestBid = await Bid.findOne({ auctionId }).sort({ bidAmount: -1 });
    const currentHighestBid = auction.highestBid ?? highestBid?.bidAmount ?? auction.startingBid ?? 0;

    if (bidAmount <= currentHighestBid) {
      return res.status(400).json({ message: `Bid must be higher than current highest bid (${currentHighestBid})` });
    }

    // Respect bid increment if defined
    if (auction.bidIncrement && currentHighestBid > 0) {
      const minAllowed = currentHighestBid + auction.bidIncrement;
      if (bidAmount < minAllowed) {
        return res.status(400).json({ message: `Bid must be at least ${minAllowed}` });
      }
    }

    // Create bid
    const bid = await Bid.create({ auctionId, userId, bidAmount });

    // Update auction’s highest bid
    auction.highestBid = bidAmount;
    await auction.save();

    res.status(201).json({ message: "Bid placed successfully", bid });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all bids for a specific auction
exports.getBidsForAuction = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const bids = await Bid.find({ auctionId })
      .populate('userId', 'name email') // optional: show bidder info
      .sort({ bidAmount: -1 });

    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all bids placed by the logged-in user
exports.getUserBids = async (req, res) => {
  try {
    const userId = req.user._id;
    const bids = await Bid.find({ userId })
      .populate({
        path: 'auctionId',
        select: 'endTime status highestBid startingBid bidIncrement productId',
        populate: {
          path: 'productId',
          select: 'title images category'
        }
      })
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
