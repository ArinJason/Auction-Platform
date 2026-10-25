const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // who receives the message
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // who sent the message
  sender: { type: String }, // optional: store sender name/email for quick display
  text: { type: String, required: true }, // message content
  read: { type: Boolean, default: false }, // track if seller has read it
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
