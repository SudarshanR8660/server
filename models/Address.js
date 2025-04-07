// models/Address.js
const mongoose = require('mongoose');

// const addressSchema = new mongoose.Schema({
//   userId: String,
//   addressType: String,
//   fullName: String,
//   addressLine1: String,
//   addressLine2: String,
//   city: String,
//   state: String,
//   postalCode: String,
//   country: String
// });

const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
});

module.exports = mongoose.model('Address', addressSchema);
