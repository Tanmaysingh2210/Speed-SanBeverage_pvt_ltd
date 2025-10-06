const mongoose = require("mongoose")

const LoadInSchema= new mongoose.Schema({
    salesmanCode: {
      type: String,
      required: true, 
    },
    date: {
      type: Date,
      required: true,
    },
    filled:{
        type:Number,
        default:0
    },
    Leaked:{
        type:Number,
        default:0
    },
    itemCode:{
        type:String,
        required:true
    }
  },
{timestamps:false})

module.exports=mongoose.model('transaction_LoadIn', LoadInSchema)

