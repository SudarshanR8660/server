const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    price: { type: Number, required: true },
    shippingAddress: { type: addressSchema, required: true },
    billingAddress: { type: addressSchema, required: true },
    orderProducts: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        imageURL: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, required: true },
        brand: { type: String, required: true },
        desc: { type: String, required: true },
      },
    ],
    createdAt: { type: Date, default: Date.now },
  });
  
  const Order = mongoose.model('Order', orderSchema);