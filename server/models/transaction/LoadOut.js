import mongoose from 'mongoose';

const loadOutSchema = new mongoose.Schema({
    salesmanCode: { type: String, required: true },
    date: { type: Date, required: true },
    trip: { type: Number },
    depo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'depo-master',
        required: true
    },
    items: [
        {
            itemCode: { type: String, required: true },
            qty: { type: Number, required: true },
        },
    ],
}, { timestamps: false });

export default mongoose.model('Transation_LoadOut', loadOutSchema);