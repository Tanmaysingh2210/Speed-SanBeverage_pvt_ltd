const mongoose = require("mongoose")

const ratesSchema = new mongoose.Schema({
    itemCode: { type: String, required: true },
    name: { type: String },
    basePrice: { type: Number, required: true },
    perTax: { type: Number, required: true },
    date: { type: Date, required: true },
    status: { type: String, default: 'Active' }

}, { timestamps: false })

// // ✅ create compound unique index
// ratesSchema.index({ itemCode: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('rates', ratesSchema);