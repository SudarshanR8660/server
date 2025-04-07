const Product = require('../models/ProductModel');

exports.createProduct = async (req, res) => {
  try {
    const productData = req.body;

    // Validate input
    if (!productData.name || !productData.imageURL || !productData.price || !productData.category || !productData.brand || !productData.desc) {
      return res.status(400).json({ message: 'Incomplete product information' });
    }

    // Create a new product
    const newProduct = new Product(productData);

    // Save product to the database
    await newProduct.save();

    return res.status(201).json({ message: 'Product created successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};



// Edit a product
exports.editProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const updatedProductData = req.body;

    // Validate input
    if (!productId || !updatedProductData) {
      return res.status(400).json({ message: 'Incomplete request' });
    }

    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update product data
    Object.assign(product, updatedProductData);

    // Save updated product to the database
    await product.save();

    return res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    // Validate input
    if (!productId) {
      return res.status(400).json({ message: 'Incomplete request' });
    }

    // Find and delete the product by ID
    await Product.findByIdAndDelete(productId);

    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};







