import mongoose from "mongoose";


const salesmanSchema = new mongoose.Schema({
  routeNo: {
    type: String,
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
  }
}, {
  timestamps: true
})

const Salesman = mongoose.model("salesman", salesmanSchema)
export default Salesman

