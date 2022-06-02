const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  prod_selected: [{
    product_id:{
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
    },
    product_qty:{
        type: Number
    }
  }],
  order_total: {
      type: Number,
      required: true
  },
  created_at: {
    type: Date
  }, 
  updated_at:{
    type: Date
  }
});

module.exports = mongoose.model("Order", orderSchema);