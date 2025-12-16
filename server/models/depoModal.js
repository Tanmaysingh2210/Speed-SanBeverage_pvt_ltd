const mongoose = require('mongoose');

const depoSchema= new mongoose.Schema({
    depoCode:{type:String , required: true},
    depoName: {type:String , required : true},
    depoAddress: {type:String }



},{timestamps:false});

module.exports = mongoose.model('depo-master', depoSchema);