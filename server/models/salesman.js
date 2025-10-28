const mongoose =require("mongoose")

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
  }
}, {
  timestamps: true
})

module.exports = mongoose.model("salesman", salesmanSchema)

