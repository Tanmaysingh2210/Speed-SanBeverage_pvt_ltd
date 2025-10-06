const mongoose = require('mongoose');

const loadOutSchema = new mongoose.Schema({
    salesman_code: { type: String, required: true },
    Date: { type: Date, required: true },
    item_code: { type: String, required: true },
    qty: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Transation_LoadOut', loadOutSchema);