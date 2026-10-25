const jwt = require('jsonwebtoken');
const User = require('../models/User'); // import your User model

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded.id must be a valid MongoDB ObjectId
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user; // attach full user document with _id
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;

