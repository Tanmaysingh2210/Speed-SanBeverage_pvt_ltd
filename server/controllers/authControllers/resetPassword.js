import User from '../../models/user.js';
import bcrypt from 'bcrypt';

export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) return res.status(400).json({ message: "email and password are required" });

        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "User not found" });

        bcrypt.genSalt(10, (err, salt) => {
            if (err) return res.status(400).json({ message: "error in creating salt" });
            bcrypt.hash(newPassword, salt, async (err, hash) => {
                if(err) return res.status(400).json({ message: "error in encrypting password" });
                user.password = hash;
                user.resetPasswordOtp = undefined;
                user.resetPasswordOtpExpire = undefined;
                await user.save();
            });
        });

        res.status(200).json({message: "Password reset successfully, you can now login with new password!"});


    } catch (err) {
        res.status(500).json({message: "error resetting password ", error:err.message});
    }
}