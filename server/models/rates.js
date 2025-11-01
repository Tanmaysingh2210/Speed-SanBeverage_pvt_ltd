const mongoose = require("mongoose")

const ratesSchema= new mongoose.Schema({
 itemCode: { type: String, required: true, unique: true },
    name: { type: String  },
    basePrice: { type: Number, required: true },
    perTax: { type: Number, required: true },
    date: { type: Date, required: true },
    status: { type: String, default: 'Active' }

} , {timestamps:true})

module.exports=mongoose.model('rates' , ratesSchema);