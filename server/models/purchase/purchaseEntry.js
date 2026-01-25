import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({

    party: {
        type: String,
        required: true,
        trim: true
    },

    // Number fields
    slno: {
        type: Number,
        required: true
    },

    gra: {
        type: Number,
        required: true
    },

    // Date field
    date: {
        type: Date,
        required: true,
        default: Date.now
    },

    // Name & Address (String)
    nameAddress: {
        type: String,
        required: true,
        trim: true
    },

    // Vehicle details
    vehicleNo: {
        type: Number,
        required: true
    },

    vnoDt: {
        type: Date,
        required: true
    },

    vno: {
        type: Number,
        required: true
    },

    // Bill, ERC, FRC (Numbers)
    bill: {
        type: Number,
        required: true
    },

    erc: {
        type: Number,
        required: true
    },

    frc: {
        type: Number,
        required: true
    },

    // Value, Discount, Total
    value: {
        type: Number,
        required: true
    },

    disc: {
        type: Number,
        default: 0
    },


    // VAT fields
    percentVat: {
        type: Number,
        required: true
    },


    // Purchase Against (Number)
    purchaseAgst: {
        type: Number,
        required: true
    },

    // Form Issue (String)
    formIssue: {
        type: String,
        trim: true
    },
    depo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'depo-master',
        required: true
    },

}, {
    timestamps: false
});


export default mongoose.model('Purchase', purchaseSchema);
