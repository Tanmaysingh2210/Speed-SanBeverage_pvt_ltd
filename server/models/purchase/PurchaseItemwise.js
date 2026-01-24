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
  remainingQty: {
    type: Number,
    required: true,
    default: function () { return this.qty; }
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

  depo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'depo-master',
    required: true
  },

  items: {
    type: [itemSchema],   // Array of objects
    default: []
  },
  isFullyProcessed: {
    type: Boolean,
    default: false,
    index: true  // Index for faster queries
  }
});

// Add index for efficient querying
purchaseItemSchema.index({ isFullyProcessed: 1, 'items.expiryDate': 1 });

module.exports = mongoose.model('PurchaseItemwise', purchaseItemSchema);
