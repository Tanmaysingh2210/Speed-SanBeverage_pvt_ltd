const mongoose = require("mongoose")

const ratesSchema= new mongoose.Schema({
    itemCode:{
        type:String,
        required:true
    },
    basePrice:{
        type:Number,
        required:true
    },
    perTax:{
        type:Number,
        required:true
    },
    Date:{
        type:Date,
        required:true
    }

} , {timestamps:true})

module.exports=mongoose.model('rates' , ratesSchema)