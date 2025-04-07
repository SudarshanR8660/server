require("dotenv").config();
const express = require("express");
const cors = require("cors");
// const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const mongoose = require("mongoose")
const User=require('./models/userModel')
const authRoutes  = require("./routes/authRoutes");
const productRoutes=require("./routes/productRoutes")
const Product = require('./models/ProductModel');
const authMiddleware = require('./middlewares/auth');
const twilio = require('twilio');
const bodyParser = require('body-parser');
const addressRouter=require("./routes/address")
const cartRoutes=require("./routes/cart")


const app = express();

app.use(cors());
app.use(express.json());
const path = require("path");






const productSchema = new mongoose.Schema({
  productId: String,
  name: String,
  imageURL: String,
  price: Number,
  category: String,
  brand: String,
  desc: String,
});

// Define schema for order
const orderSchema = new mongoose.Schema({
  userId:String,
  name: String,
  price: Number,
  createdAt: { type: Date, default: Date.now },
  orderProducts: [productSchema], // Define the orderProducts array with the productSchema
  shippingAddress: {
    fullName: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  billingAddress: {
    fullName: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  orderStatus: { type: String, default: 'Pending' }
});

// Create model based on order schema
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

// Body parser middleware
app.use(bodyParser.json());












const PORT = process.env.PORT || 4242;




// MongoDB connection setup
mongoose.connect('mongodb+srv://sudarshan:sudarshan123@cluster0.5nkds9r.mongodb.net/E-commerces', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

app.use('/uploads', express.static('uploads'));

app.use('/api/products', productRoutes);

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});




////wishlist
const userWishlists = {};

// Endpoint to add a product to the wishlist
app.post('/api/wishlist', (req, res) => {
  const { userId, productId, name, brand, desc, price,imageURL} = req.body;

  // Ensure the user has an existing wishlist array or create one
  userWishlists[userId] = userWishlists[userId] || [];

  // Add the product to the user's wishlist
  userWishlists[userId].push({ productId, name, brand, desc, price,imageURL });

  res.status(200).json({ message: 'Product added to wishlist successfully' });
});

// Endpoint to fetch the wishlist for a specific user
app.get('/api/wishlist/:userId', (req, res) => {
  const requesterUserId = req.params.userId;
  const targetUserId = req.query.targetUserId;

  // Check if the requester is trying to fetch their own wishlist or if a target user is specified
  const wishlistData = userWishlists[targetUserId || requesterUserId] || [];

  if (targetUserId && requesterUserId !== targetUserId) {
    // Requester is trying to fetch someone else's wishlist
    res.status(403).json({ message: 'Unauthorized to access this wishlist' });
  } else {
    res.status(200).json(wishlistData);
  }
});

app.delete('/api/wishlist/:userId/:productId', (req, res) => {
  const userId = req.params.userId;
  const productId = req.params.productId;

  // Check if the user has a wishlist
  const userWishlist = userWishlists[userId];

  if (!userWishlist) {
    return res.status(404).json({ message: 'User not found or user does not have a wishlist' });
  }

  // Find the index of the product with the specified productId in the user's wishlist
  const productIndex = userWishlist.findIndex(product => product.productId === productId);

  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found in the user\'s wishlist' });
  }

  // Remove the product from the user's wishlist
  userWishlist.splice(productIndex, 1);

  res.status(200).json({ message: 'Product removed from wishlist successfully' });
});

app.use('/api/address', addressRouter);










// Middleware for parsing JSON bodies
app.use(bodyParser.json());
















// const orderSchema = new mongoose.Schema({
//   userId: { type: String, required: true },
//   price: { type: Number, required: true },
//   shippingAddress: { type: addressSchema, required: true },
//   billingAddress: { type: addressSchema, required: true },
//   orderProducts: [
//     {
//       productId: { type: String, required: true },
//       name: { type: String, required: true },
//       imageURL: { type: String, required: true },
//       price: { type: Number, required: true },
//       category: { type: String, required: true },
//       brand: { type: String, required: true },
//       desc: { type: String, required: true },
//     },
//   ],
//   createdAt: { type: Date, default: Date.now },
// });

// const Order = mongoose.model('Order', orderSchema);

// Server-side route for creating a payment intent

// app.post('/create-payment-intent', async (req, res) => {
//   try {
//     const { amount, cartData, userId, shippingAddress, billingAddress } = req.body;

//     // Create an array to store all products in the order
//     const orderProducts = cartData.map((product) => ({
//       productId: product.productId,
//       name: product.name,
//       imageURL: product.imageURL,
//       price: product.price,
//       category: product.category,
//       brand: product.brand,
//       desc: product.desc,
//     }));

//     // Create a single order containing all products and their details, including userId
//     const order = new Order({
//       userId: userId,
//       price: amount, // total amount for all products
//       shippingAddress: {
//         fullName: shippingAddress.fullName,
//         addressLine1: shippingAddress.addressLine1,
//         addressLine2: shippingAddress.addressLine2,
//         city: shippingAddress.city,
//         state: shippingAddress.state,
//         postalCode: shippingAddress.postalCode,
//         country: shippingAddress.country,
//       },
//       billingAddress: {
//         fullName: billingAddress.fullName,
//         addressLine1: billingAddress.addressLine1,
//         addressLine2: billingAddress.addressLine2,
//         city: billingAddress.city,
//         state: billingAddress.state,
//         postalCode: billingAddress.postalCode,
//         country: billingAddress.country,
//       },
//       orderProducts, // Include all products in the order
//       createdAt: new Date(),
//     });

//     // Save the combined order to the database
//     const savedOrder = await order.save();

//     // Create a payment intent
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount * 100, // The amount in cents
//       currency: 'usd', // Currency code
//     });

//     // Return the client secret and order ID
//     res.json({ clientSecret: paymentIntent.client_secret, orderId: savedOrder._id });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: error.message });
//   }
// });


const stripe = require('stripe')('sk_test_51P0g2wRsTKiTtWc7sgRhM8mT4aRbvjJf2iTvADNC6STRkfSxpz0FsWQXDxtnmlbw06YDiBFu0NwcMAmH3hPrJrln0093FqDj1r');
// app.post('/create-payment-intent', async (req, res) => {
//   try {
//     const { amount, cartData, userId, shippingAddress, billingAddress } = req.body;

//     const orderProducts = cartData.map((product) => ({
//       productId: product.productId,
//       name: product.name,
//       imageURL: product.imageURL,
//       price: product.price,
//       category: product.category,
//       brand: product.brand,
//       desc: product.desc,
//     }));

//     const order = new Order({
//       userId,
//       price: amount,
//       shippingAddress,
//       billingAddress,
//       orderProducts,
//     });

//     const savedOrder = await order.save();

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount * 100,
//       currency: 'usd',
//     });

//     res.json({ clientSecret: paymentIntent.client_secret, orderId: savedOrder._id });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// const orderSchema = new mongoose.Schema({
//   userId: String,
//   price: Number,
//   shippingAddress: String,
//   billingAddress: String,
//   orderProducts: [
//     {
//       productId: String,
//       name: String,
//       imageURL: String,
//       price: Number,
//       category: String,
//       brand: String,
//       desc: String,
//     },
//   ],
// });

// const Order = mongoose.model('Order', orderSchema);

app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, cartData, userId, shippingAddress, billingAddress } = req.body;

    if (!cartData || !Array.isArray(cartData)) {
      return res.status(400).json({ error: 'Invalid or missing cart data' });
    }

    const orderProducts = cartData.map((product) => ({
      productId: product.productId,
      name: product.name,
      imageURL: product.imageURL,
      price: product.price,
      category: product.category,
      brand: product.brand,
      desc: product.desc,
    }));

    const order = new Order({
      userId,
      price: amount,
      shippingAddress,
      billingAddress,
      orderProducts,
    });

    const savedOrder = await order.save();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
    });

    res.json({ clientSecret: paymentIntent.client_secret, orderId: savedOrder._id });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});


app.get('/userorders', authMiddleware, async (req, res) => {
  const userId = req.user.userId; // Assuming userId is available in the request user object

  try {
    const orders = await Order.find({ userId });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});






// Assuming you have an Order model imported and defined somewhere

app.get('/orders', async (req, res) => {
  try {
    // Fetch all orders from the database
    const orders = await Order.find();

    // Return the orders as JSON response
    res.json({ orders });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ order });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ error: 'Error fetching order details' });
  }
});






app.put('/api/orders/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { orderStatus } = req.body;

    // Validate input
    if (!orderStatus) {
      return res.status(400).json({ error: 'Order status is required' });
    }

    // Update order status in the database
    const updatedOrder = await Order.findByIdAndUpdate(orderId, { orderStatus }, { new: true });

    // Check if order exists
    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order: updatedOrder });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Error updating order status' });
  }
});

app.get('/api/userorders/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/users/orders/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    // Fetch the order from the database based on the orderId
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ order });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ error: 'Error fetching order details' });
  }
});




app.get('/userorders', authMiddleware, async (req, res) => {
  const userId = req.user._id;
  console.log("user",userId)
  try {
    const orders = await OrderModel.find({ userId });
    res.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.get('/api/users/:userId/orders', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while fetching orders', error: err.message });
  }
});















//cart

const userCarts = {};

// Endpoint to add a product to the cart
app.post('/api/cart', (req, res) => {
  const { userId, productId, name, brand, desc, price } = req.body;

  // Ensure the user has an existing cart array or create one
  userCarts[userId] = userCarts[userId] || [];

  // Add the product to the user's cart
  userCarts[userId].push({ productId, name, brand, desc, price });

  res.status(200).json({ message: 'Product added to cart successfully' });
});

// Endpoint to fetch the cart for a specific user
app.get('/api/cart/:userId', (req, res) => {
  const userId = req.params.userId;

  // Check if the user has a cart
  const userCart = userCarts[userId] || [];
  res.status(200).json(userCart);
});

// Endpoint to remove a product from the cart
app.delete('/api/cart/:userId/:productId', (req, res) => {
  const userId = req.params.userId;
  const productId = req.params.productId;

  // Check if the user has a cart
  const userCart = userCarts[userId];

  if (!userCart) {
    return res.status(404).json({ message: 'User not found or user does not have a cart' });
  }

  // Find the index of the product with the specified productId in the user's cart
  const productIndex = userCart.findIndex(product => product.productId === productId);

  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found in the user\'s cart' });
  }

  // Remove the product from the user's cart
  userCart.splice(productIndex, 1);

  res.status(200).json({ message: 'Product removed from cart successfully' });
});

//stripe
app.use('/api/cart', cartRoutes);






// const productSchema = new mongoose.Schema({
//   name: String,
//   brand: String,
//   desc: String,
//   price: Number,
//   imageURL: String
// });

// const Product = mongoose.model('Product', productSchema);

const cartSchema = new mongoose.Schema({
  userId: String,
  products: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      name: String,
      brand: String,
      desc: String,
      price: Number,
      imageURL: String,
      quantity: Number
    }
  ]
});

const Cart = mongoose.model('Cart', cartSchema);

// Get products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add to cart
app.post('/api/cart', async (req, res) => {
  const { userId, product } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }
    const productIndex = cart.products.findIndex(p => p.productId.toString() === product.productId);
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ ...product, quantity: 1 });
    }
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get cart
app.get('/api/cart/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const cart = await Cart.findOne({ userId });
    if (cart) {
      res.json(cart.products);
    } else {
      res.json([]);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



















































































































app.get('/api/dashboard/stats', async (req, res) => {
  try {
    // Get total products count
    const totalProducts = await Product.countDocuments();
    
    // Get total orders count
    const totalOrders = await Order.countDocuments();
    
    // Calculate total revenue
    const revenueData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$price" }
        }
      }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
    
    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name price createdAt orderStatus');
    
    // Get top selling products
    const topProducts = await Order.aggregate([
      { $unwind: "$orderProducts" },
      {
        $group: {
          _id: "$orderProducts.productId",
          name: { $first: "$orderProducts.name" },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, name: 1, count: 1 } }
    ]);
    
    // Get category distribution
    const categoryDistribution = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      },
      { $project: { _id: 0, category: "$_id", count: 1 } }
    ]);
    
    // Get order status distribution
    const orderStatusDistribution = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 }
        }
      },
      { $project: { _id: 0, status: "$_id", count: 1 } }
    ]);
    
    // Get monthly revenue data
    const monthlyRevenue = await Order.aggregate([
      {
        $group: {
          _id: { 
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          revenue: { $sum: "$price" }
        }
      },
      {
        $project: {
          _id: 0,
          month: {
            $let: {
              vars: {
                monthNames: [
                  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                ]
              },
              in: {
                $arrayElemAt: ['$$monthNames', { $subtract: ['$_id.month', 1] }]
              }
            }
          },
          revenue: 1
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    // Send all data
    res.json({
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      topProducts,
      categoryDistribution,
      orderStatusDistribution,
      monthlyRevenue
    });
    
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.use('/api/v1/auth',authRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "build", "index.html"));
  });
}
