const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  images: [String],
  basePrice: { type: Number, required: true },
  category: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
