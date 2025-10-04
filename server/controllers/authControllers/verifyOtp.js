const User = require('../../models/user');

exports.verify_otp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "user not exist" });
        if (user.isVerified == true) res.status(201).json({ message: "user already verified" });
        if (String(user.otp) !== String(otp) || user.otpExpire < new Date()) {
            res.status(400).json({ message: "invalid or expired otp" });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpire = undefined;
        await user.save();

        req.session.regenerate(err => {
            if (err) {
                console.error("Session regenerate error:", err);
                return res.status(500).json({ message: "Error starting session" });
            }
            req.session.user = { id: user._id, email: user.email, name: user.name };
            console.log("session data: ", req.session);
            console.log("Session id : " , req.sessionID);
            
            res.status(200).json({ message: "Otp verified succesfully." });
        });
    } catch (err) {
        res.status(400).json("Error in verification: ", err);
    }
}