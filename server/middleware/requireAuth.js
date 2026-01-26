import User from '../models/user.js';

const requireAuth = async (req, res, next) => {
    try {
        // 1️⃣ Check session exists
        if (!req.session || !req.session.user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: not logged in'
            });
        }

        // 2️⃣ Fetch user from DB (important)
        const user = await User.findById(req.session.user.id).select('-password');

        if (!user) {
            // Session exists but user deleted
            req.session.destroy(() => {});
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: user not found'
            });
        }

        // 3️⃣ Attach user to request
        req.user = user;

        next();
    } catch (error) {
        console.error('Session auth error:', error);
        return res.status(500).json({
            success: false,
            message: 'Authentication failed'
        });
    }
};

export default requireAuth;
