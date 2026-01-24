import mongoose from 'mongoose';

const cash_creditSchema = new mongoose.Schema({
    crNo: {
        type: Number,
        required: true
    },
    salesmanCode: { type: String, required: true },
    trip: { type: Number, required: true },
    date: { type: Date, required: true },
    value: { type: Number, required: true },
    tax: { type: Number, required: true },
    ref: { type: Number },
    cashDeposited: { type: Number },
    chequeDeposited: { type: Number },
    remark: { type: String },
    depo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'depo-master',
        required: true
    },
}, { timestamps: false })

export default mongoose.model('Transaction_cash_credit', cash_creditSchema);