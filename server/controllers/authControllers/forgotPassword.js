const User = require('../../models/user');
const crypto = require('crypto');
const { transporter } = require('./register');


const generateOtp = () => crypto.randomInt(100000, 999999).toString();

exports.forgotPassword = async (req, res) => {
    try {

        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "user not registered!" });
        if (!user.isVerified) return res.status(400).json({ message: "User not verified! Please Verify" });

        const resetOtp = generateOtp();
        const resetOtpExpire = new Date(Date.now() + 5 * 60 * 1000);

        user.resetPasswordOtp = resetOtp;
        user.resetPasswordOtpExpire = resetOtpExpire;
        await user.save();

        await transporter.sendMail({
            from: 'kisansathiservice@gmail.com',
            to: email,
            subject: 'otp verification',
            text: `Your reset password otp is: ${resetOtp} . verify to change password.`
        })

        res.status(200).json({ message: `reset otp sent to ${email}. verify to change password` });


    } catch (err) {
        res.status(500).json({ message: "Error sending reset otp: ", error: err.message });
    }
}