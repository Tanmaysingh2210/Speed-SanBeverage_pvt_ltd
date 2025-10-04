const nodemailer=require('nodemailer');
const crypto=require('crypto');
const User = require('../../models/user');
const bcrypt = require('bcrypt');

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'kisansathiservice@gmail.com',
        pass:'zufwxczkbrmmxcpi'
    }
});

exports.transporter = transporter;

const generateOtp = () => crypto.randomInt(100000 , 999999).toString();


exports.register = async (req, res)=>{
    try{
        const{name,email,password,depo} = req.body;
        let user = await User.findOne({email});
        if(user) return req.status(400).json({message:"user already exists"});

        const otp = generateOtp();
        const otpExpire = new Date(Date.now()+5*60*1000);
        

        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(password, salt, async (err,hash)=>{
                await User.create({
                    name,
                    email,
                    password:hash,
                    depo,
                    otp,
                    otpExpire
                })
            })
        });

        await transporter.sendMail({
            from:'kisansathiservice@gmail.com',
            to:email,
            subject:'otp verification',
            text:`Your otp is: ${otp} to register on Speed website`
        })

        res.status(201).json({message:"User registered. otp sent to email Please verify!"})

    }catch(err){
        res.status(500).json({message:"Error registering user", err});
    }
}