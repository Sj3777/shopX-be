const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  product_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
  },
  product_qty: {
    type: Number,
  },
  created_at: {
    type: Date
  }, 
  updated_at:{
    type: Date
  }
});

module.exports = mongoose.model("Cart", cartSchema);