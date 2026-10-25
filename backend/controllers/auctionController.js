const Auction = require('../models/Auction');
const Product = require('../models/Product');
const Bid = require('../models/Bid'); // include bids for closing logic

const finalizeAuction = async (auction) => {
  const winningBid = await Bid.findOne({ auctionId: auction._id })
    .sort({ bidAmount: -1, createdAt: 1 });

  const closedAuction = await Auction.findOneAndUpdate(
    { _id: auction._id, status: "active" },
    {
      $set: {
        status: "closed",
        ...(winningBid ? { highestBid: winningBid.bidAmount } : {})
      }
    },
    { new: true }
  );
  if (!closedAuction) return null;

  await Bid.updateMany({ auctionId: auction._id }, { $set: { isWinningBid: false } });
  if (winningBid) {
    winningBid.isWinningBid = true;
    await winningBid.save();
  }

  return { auction: closedAuction, winningBid };
};

let closingExpiredAuctions = false;
const closeExpiredAuctions = async () => {
  if (closingExpiredAuctions) return;
  closingExpiredAuctions = true;
  try {
    const expiredAuctions = await Auction.find({
      status: "active",
      endTime: { $lte: new Date() }
    });

    for (const auction of expiredAuctions) {
      await finalizeAuction(auction);
    }
  } finally {
    closingExpiredAuctions = false;
  }
};

// Create auction (with product creation)
const createAuction = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      condition,
      quantity,
      auctionType,
      reservePrice,
      startingBid,
      buyNowPrice,
      bidIncrement,
      startTime,
      endTime,
      autoExtend,
      featured
    } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    // Step 1: create product with required fields
    const product = await Product.create({
      title,
      description,
      category,
      condition,
      quantity,
      basePrice: startingBid || reservePrice || buyNowPrice,
      sellerId: req.user._id
    });

    // Step 2: create auction linked to product
    const auction = await Auction.create({
      productId: product._id,
      auctionType,
      reservePrice,
      startingBid,
      buyNowPrice,
      bidIncrement,
      startTime: new Date(startTime || Date.now()),
      endTime: new Date(endTime || Date.now() + 24 * 60 * 60 * 1000),
      autoExtend,
      featured,
      status: "active",
      sellerId: req.user._id // ✅ store seller directly in auction for easier queries
    });

    res.status(201).json(auction);
  } catch (err) {
    console.error("Create auction error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all auctions
const getAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find().populate('productId');

    for (const auction of auctions) {
      const latestBid = await Bid.findOne({ auctionId: auction._id }).sort({ bidAmount: -1 });
      auction.highestBid = latestBid ? latestBid.bidAmount : auction.highestBid ?? auction.startingBid ?? 0;
    }

    res.json(auctions);
  } catch (err) {
    console.error("Get auctions error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single auction
const getAuctionById = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id).populate('productId');
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    const latestBid = await Bid.findOne({ auctionId: auction._id }).sort({ bidAmount: -1 });
    auction.highestBid = latestBid ? latestBid.bidAmount : auction.highestBid ?? auction.startingBid ?? 0;

    res.json(auction);
  } catch (err) {
    console.error("Get auction by ID error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Close auction (mark winning bid)
const closeAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: "Auction not found" });
    if (req.user.role !== "seller" || auction.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to end this auction" });
    }
    if (auction.status !== "active") {
      return res.status(400).json({ message: "Only active auctions can be ended" });
    }

    const result = await finalizeAuction(auction);
    if (!result) {
      return res.status(409).json({ message: "Auction is no longer active" });
    }

    res.json({ message: "Auction closed", ...result });
  } catch (err) {
    console.error("Close auction error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const cancelAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: "Auction not found" });
    if (req.user.role !== "seller" || auction.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this auction" });
    }
    if (auction.status !== "active") {
      return res.status(400).json({ message: "Only active auctions can be cancelled" });
    }

    const cancelledAuction = await Auction.findOneAndUpdate(
      { _id: auction._id, status: "active" },
      { $set: { status: "cancelled" } },
      { new: true }
    );
    if (!cancelledAuction) {
      return res.status(409).json({ message: "Auction is no longer active" });
    }
    await Bid.updateMany({ auctionId: auction._id }, { $set: { isWinningBid: false } });

    res.json({ message: "Auction cancelled", auction: cancelledAuction });
  } catch (err) {
    console.error("Cancel auction error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Activate auction
const activateAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    auction.status = "active";
    await auction.save();

    res.json({ message: "Auction activated", auction });
  } catch (err) {
    console.error("Activate auction error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get auctions for logged-in seller
const getSellerAuctions = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    const auctions = await Auction.find({ sellerId: req.user._id }).populate('productId');
    const winningBids = await Bid.find({
      auctionId: { $in: auctions.map((auction) => auction._id) },
      isWinningBid: true
    }).select('auctionId bidAmount userId');
    const winningBidsByAuction = new Map(
      winningBids.map((bid) => [bid.auctionId.toString(), bid])
    );

    res.json(auctions.map((auction) => ({
      ...auction.toObject(),
      winningBid: winningBidsByAuction.get(auction._id.toString()) || null
    })));
  } catch (err) {
    console.error("Get seller auctions error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createAuction,
  getAuctions,
  getAuctionById,
  closeAuction,
  cancelAuction,
  closeExpiredAuctions,
  activateAuction,
  getSellerAuctions
};
