import User from '../../models/user.js';
import bcrypt from 'bcrypt';

export const login = async (req, res) => {
    try {

        const { email, password } = req.body;

         if (!email || !password) return res.status(400).json({ message: "Email and password are required!" });
        const user = await User.findOne({ email });

       
        if (!user) return res.status(400).json({ message: "User not registered" });
        if (!user.isVerified) return res.status(400).json({ message: "Email not verified, please verify" });

        const match = await bcrypt.compare(password, user.password);

        if (!match) return res.status(400).json({ message: "Email or Password incorrect" });

        req.session.regenerate(err => {
            if (err) {
                console.error("Session regenerate error:", err);
                return res.status(500).json({ message: "Error starting session" });
            }

            req.session.user = { id: user._id, email: user.email, name: user.name };
            console.log("session: ", req.session);
            console.log("sessionID: ", req.sessionID);
            res.json({ message: 'Logged in successfully' });
        });
    } catch (err) {
        res.status(500).json({ message: "Error logging in", err });
    }
}