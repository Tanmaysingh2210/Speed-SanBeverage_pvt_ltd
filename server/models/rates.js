const mongoose = require("mongoose");

const ratesSchema = new mongoose.Schema({
    itemCode: { type: String, required: true },
    basePrice: { type: Number, required: true },
    perTax: { type: Number, required: true },
    perDisc: { type: Number },
    date: { type: Date, required: true },
    status: { type: String, default: 'Active' }

}, { timestamps: false })

// // ✅ create compound unique index
// ratesSchema.index({ itemCode: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('rates', ratesSchema);