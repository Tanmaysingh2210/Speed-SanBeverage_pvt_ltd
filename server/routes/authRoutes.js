const express = require('express');
const { register } = require('../controllers/authControllers/register.js');
const { verify_otp } = require('../controllers/authControllers/verifyOtp.js');
const { login } = require('../controllers/authControllers/login.js');
const { resend_otp } = require('../controllers/authControllers/resendOtp.js');
const { logout } = require('../controllers/authControllers/logout.js');
const { forgotPassword } = require('../controllers/authControllers/forgotPassword.js');
const { verify_reset_pass_otp } = require('../controllers/authControllers/verifyresetPassOtp.js');
const { resetPassword } = require('../controllers/authControllers/resetPassword.js');

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


module.exports = router;