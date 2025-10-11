const mongoose = require('mongoose');

const cash_creditSchema = new mongoose.Schema({
    CRNo: {type:Number,
        required:true
    },
    SalesmanCode: {type:String, required:true},
    Trip: {type:Number, required:true},
    Date:{type:Date,required:true},
    Value: {type:Number, required:true},
    Tax:{type:Number, required:true}

},{timestamps:false})

module.exports = mongoose.model('Transaction_cash_credit', cash_creditSchema);