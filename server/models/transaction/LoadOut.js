const mongoose = require('mongoose');

const loadOutSchema = new mongoose.Schema({
    salesmanCode: { type: String, required: true },
    date: { type: Date, required: true },
    trip: { type: Number },
    items: [
        {
            itemCode: { type: String, required: true },
            qty: { type: Number, required: true },
        },
    ],
}, { timestamps: false });

module.exports = mongoose.model('Transaction_LoadOut', loadOutSchema);