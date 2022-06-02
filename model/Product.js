const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  p_name: {
    type: String,
    required: true,
  },
  p_description: {
    type: String,
    required: true,
  },
  p_price: {
    type: Number,
    required: true,
  },
  p_qty: {
    type: Number,
    required: true,
  },
  p_image: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date
  }, 
  updated_at:{
    type: Date
  }
});

module.exports = mongoose.model("Product", productSchema);