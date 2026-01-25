import mongoose from "mongoose"

const salesmanSchema = new mongoose.Schema({
  routeNo: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  codeNo: {
    type: String,
    required: true,
    unique: true
  },
  depo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'depo-master',
    required: true
  },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, {
  timestamps: false
})

export default mongoose.model("salesman", salesmanSchema)

