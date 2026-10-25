const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  auctionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bidAmount: {
    type: Number,
    required: true,
    min: 1 // prevent zero/negative bids
  },
  isWinningBid: {
    type: Boolean,
    default: false // mark true when auction closes
  }
}, { timestamps: true });

module.exports = mongoose.model('Bid', bidSchema);
