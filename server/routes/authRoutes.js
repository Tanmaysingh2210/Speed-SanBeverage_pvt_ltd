import express from 'express';
import { register } from '../controllers/authControllers/register.js';
import { verify_otp } from '../controllers/authControllers/verifyOtp.js';
import { login } from '../controllers/authControllers/login.js';
import { resend_otp } from '../controllers/authControllers/resendOtp.js';
import { logout } from '../controllers/authControllers/logout.js';
import { forgotPassword } from '../controllers/authControllers/forgotPassword.js';
import { verify_reset_pass_otp } from '../controllers/authControllers/verifyresetPassOtp.js';
import { resetPassword } from '../controllers/authControllers/resetPassword.js';

const router = express.Router();

router.post("/register", register);
router.post('/verify_otp', verify_otp);
router.post('/resend_otp', resend_otp);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot_password', forgotPassword);
router.post('/verify_reset_otp', verify_reset_pass_otp);
router.post('/reset_password', resetPassword);

router.get('/me', (req, res) => {
    if (req.session && req.session.user) {
        return res.json({ user: req.session.user });
    }
    return res.status(200).json({ user: null });
});


export default router;