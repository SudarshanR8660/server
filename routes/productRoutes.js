const express = require('express');
const router = express.Router();
const Product = require('../models/ProductModel');

const multer = require('multer');
const productController = require('../controllers/productControllers');
const upload=require('../middlewares/upload')

// Define route for creating a product



// Multer storage configuration


// POST /api/products/create-product
// router.post('/create-product', productController.createProduct)

router.post('/create-product', upload.single('image'), async (req, res) => {
    try {
      const { name, price, category, brand, desc } = req.body;
      const imageURL = req.file ? req.file.path : ''; // Check if file uploaded
  
      const product = new Product({ name, price, category, brand, desc, imageURL });
      await product.save();
  
      res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
// Edit a product
router.put('/:productId', productController.editProduct);

// Delete a product
router.delete('/:productId', productController.deleteProduct);

module.exports = router;
