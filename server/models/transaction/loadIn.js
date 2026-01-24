const mongoose = require("mongoose")

const LoadInSchema = new mongoose.Schema({
  salesmanCode: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  trip: {
    type: Number,
    default: 1
  },
  depo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'depo-master',
        required: true
    },
  items: [
    {
      itemCode: { type: String, required: true },
      Filled: { type: Number, default: 0 },
      Burst: { type: Number, default: 0 },
      Emt:{type:Number, default:0 }
    }
  ],
},
  { timestamps: false })

module.exports = mongoose.model('transaction_LoadIn', LoadInSchema)

