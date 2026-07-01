const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Create Product
router.post("/", protect, createProduct);

// Get All Products
router.get("/", getProducts);

// Update Product
router.put("/:id", protect, updateProduct);

// Delete Product
router.delete("/:id", protect, deleteProduct);

module.exports = router;