const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cpassword: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
    displayName: String,
  },
  {
    timestamps: true
  }
);

const userModel = mongoose.model('User', userSchema);

module.exports = {userModel};




// const mongoose = require("mongoose");

// const wishlistItemSchema = new mongoose.Schema({
//   productId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Product",
//     required: true,
//   },
//   productName: { type: String, required: true },
//   brand: { type: String, required: true },
//   desc: { type: String, required: true },
//   price: { type: Number, required: true },
// });

// const userSchema = new mongoose.Schema(
//   {
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     cpassword: { type: String, required: true },
//     isAdmin: { type: Boolean, default: false, required: true },
//     wishlist: [wishlistItemSchema], // Add the wishlist field as an array of wishlist items
//   },
//   {
//     timestamps: true,
//   }
// );

// const userModel = mongoose.model("User", userSchema);

// module.exports = { userModel };

