const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    depo: { type: String, required: true },
    otp: { type: String },
    otpExpire:{type:Date},
    isVerified:{type:Boolean, default:false},
    resetPasswordOtp:{type:String},
    resetPasswordOtpExpire:{type:Date},
})

module.exports = mongoose.model('user', userSchema);