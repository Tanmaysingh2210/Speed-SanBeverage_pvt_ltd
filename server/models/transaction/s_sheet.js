import mongoose from 'mongoose';

const s_sheetSchema = new mongoose.Schema({

    salesmanCode: { type: String, required: true },
    date: { type: Date, required: true },
    trip: { type: Number },
    schm: { type: Number },
    depo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'depo-master',
        required: true
    },

}, { timestamps: false });

export default mongoose.model('Transaction_s_sheet', s_sheetSchema);