const mongoose =  require('mongoose');

const s_sheetSchema= new mongoose.Schema({

    salesmanCode:{ type: String, required: true },
    date:{type :Date ,required :true},
    trip: {type :Number},
    schm:{type:Number}

},{timestamps : false});

module.exports = mongoose.model('Transaction_s_sheet' , s_sheetSchema);