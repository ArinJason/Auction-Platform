const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const Product = require('../models/Product');

// Create product
router.post('/', authMiddleware, createProduct);

// Get all products
router.get('/', getProducts);

// ✅ IMPORTANT: /seller must come BEFORE /:id
router.get('/seller', authMiddleware, async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized: user not found in request' });
    }

    const products = await Product.find({ sellerId: req.user._id });
    res.json(products);
  } catch (err) {
    console.error('Products seller route error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get product by ID
// router.get('/:id', getProductById);

// Update product
router.put('/:id', authMiddleware, updateProduct);

// Delete product
router.delete('/:id', authMiddleware, deleteProduct);

module.exports = router;
