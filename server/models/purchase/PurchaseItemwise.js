const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemCode: {
    type: String,
    required: true
  },
  qty: {
    type: Number,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  }
});

const purchaseItemSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },

  items: {
    type: [itemSchema],   // Array of objects
    default: []
  }
});

module.exports = mongoose.model('PurchaseItemwise', purchaseItemSchema);
