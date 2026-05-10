import User from '../../models/user.js';
import bcrypt from 'bcrypt';
import { getDefaultCredentials } from '../../config/initDefaultUser.js';

export const autoLoginIfNeeded = async (req, res) => {
    try {
        // If already logged in, return existing user
        if (req.session && req.session.user) {
            return res.json({ user: req.session.user });
        }

        // Auto-login with default credentials
        const { email, password } = getDefaultCredentials();
        const user = await User.findOne({ email })
            .populate('depo');

        if (!user) {
            return res.status(200).json({ user: null });
        }

        if (!user.isVerified) {
            return res.status(200).json({ user: null });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(200).json({ user: null });
        }

        // Regenerate session and set user
        req.session.regenerate((err) => {
            if (err) {
                console.error("Session regenerate error:", err);
                return res.status(200).json({ user: null });
            }

            req.session.user = { 
                id: user._id, 
                email: user.email, 
                name: user.name, 
                depo: user.depo 
            };
            
            res.json({ user: req.session.user });
        });
    } catch (err) {
        console.error('Auto-login error:', err);
        return res.status(200).json({ user: null });
    }
};
