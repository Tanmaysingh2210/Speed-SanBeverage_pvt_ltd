import User from '../../models/user.js';


export const verify_reset_pass_otp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) return res.status(400).json({ message: "Email and Otp are required" });

        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "User not registered" });

        if (String(user.resetPasswordOtp) !== String(otp) || user.resetPasswordOtpExpire < new Date()) return res.status(400).json({ message: "invalid or expired otp" });

        res.status(200).json({ message: "otp verified, you can now reset password", resetToken: true });

    } catch (err) {
        res.status(500).json({message: "Error verifying reset otp " , error: err.message});
    }
} 