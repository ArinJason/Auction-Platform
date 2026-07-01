const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    endTime: {
      type: Date,
      required: true
    },
    currentHighestBid: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Auction", auctionSchema);