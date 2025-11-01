const mongoose = require('mongoose');

const loadOutSchema = new mongoose.Schema({
    salesmanCode: { type: String, required: true },
    Date: { type: Date, required: true },
    items: [
        {
            itemCode: { type: String, required: true },
            qty: { type: Number, required: true },
        },
    ],
}, { timestamps: false });

module.exports = mongoose.model('Transation_LoadOut', loadOutSchema);