import User from '../../models/user.js';

export const verify_otp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "user not exist" });
        if (user.isVerified == true) return res.status(201).json({ message: "user already verified" });
        if (String(user.otp) !== String(otp) || user.otpExpire < new Date()) {
            return res.status(400).json({ message: "invalid or expired otp" });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpire = undefined;
        await user.save();


        res.status(200).json({
            message: "OTP verified successfully",
        });

    } catch (err) {
        console.error("Error in verification:", err);
        res.status(400).json({ message: "Error in verification", error: err.message });
    }
}