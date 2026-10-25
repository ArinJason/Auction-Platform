const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Message = require('../models/Message'); // create this model if not already

// Get messages for logged-in seller
router.get('/seller', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({ sellerId: req.user._id });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
