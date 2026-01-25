import mongoose from 'mongoose';

const depoSchema= new mongoose.Schema({
    depoCode:{type:String , required: true},
    depoName: {type:String , required : true},
    depoAddress: {type:String }
},{timestamps:false});

export default mongoose.model('depo-master', depoSchema);