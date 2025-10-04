const User = require('../../models/user');
const nodemailer = require('nodemailer');
const { transporter } = require('./register');
const crypto = require('crypto');

const generateOtp = () => crypto.randomInt(100000, 999999).toString();

exports.resend_otp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "User not registered" });
        if (user.isVerified) return res.status(400).json({ message: "user already verified, You can login" });

        const otp = generateOtp();
        const otpExpire = new Date(Date.now() + 5 * 60 * 1000);

        await transporter.sendMail({
            from: 'kisansathiservice@gmail.com',
            to: email,
            subject: 'otp verification - Resended otp',
            text: `Your otp is: ${otp} to register on Speed website`
        })

        user.otp = otp;
        user.otpExpire = otpExpire;
        await user.save();
        

        res.status(201).json({ message: "Otp resended successfully" });

    } catch (err) {
        console.error("Resend OTP error:", err);
        res.status(500).json({ message: "Error resending otp", error: err.message });
    }
}