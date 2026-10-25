const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  sellerId: {   // ✅ add seller reference
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  auctionType: {
    type: String,
    required: true
  },
  reservePrice: {
    type: Number,
    required: true
  },
  startingBid: { type: Number },   // optional but useful
  buyNowPrice: { type: Number },   // optional
  bidIncrement: { type: Number },  // optional
  highestBid: {
    type: Number,
    default: 0
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date,
    required: true
  },
  autoExtend: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["pending", "active", "closed", "cancelled"],
    default: "pending"
  },
  bids: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bid'
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Auction', auctionSchema);
