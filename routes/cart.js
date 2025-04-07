// API Endpoints
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const CartItem = require('../models/Cart');

// Add product to cart
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const cartItem = await CartItem.findOne({ userId, productId });

    if (cartItem) {
      cartItem.quantity += quantity || 1;
      await cartItem.save();
    } else {
      await CartItem.create({ userId, productId, quantity });
    }

    res.status(200).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's cart
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const userId = req.params.userId;
    const userCart = await CartItem.find({ userId }).populate('productId');
    res.status(200).json(userCart);
  } catch (error) {
    console.error('Error fetching user cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove product from cart
router.delete('/:userId/:productId', authMiddleware, async (req, res) => {
  try {
    const { userId, productId } = req.params;
    await CartItem.deleteOne({ userId, productId });
    res.status(200).json({ message: 'Product removed from cart successfully' });
  } catch (error) {
    console.error('Error removing product from cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
