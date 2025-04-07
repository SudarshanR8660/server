const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  imageURL: String,
  price: Number,
  category: String,
  brand: String,
  desc: String,
  createdAt: { type: Date, default: Date.now },
  editedAt: Date,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;


