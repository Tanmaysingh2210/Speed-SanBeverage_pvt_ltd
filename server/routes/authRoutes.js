const express = require('express');
const { register } = require('../controllers/authControllers/register');
const { verify_otp } = require('../controllers/authControllers/verifyOtp');
const { login } = require('../controllers/authControllers/login');
const { resend_otp } = require('../controllers/authControllers/resendOtp');
const { logout } = require('../controllers/authControllers/logout');
const { forgotPassword } = require('../controllers/authControllers/forgotPassword');
const { verify_reset_pass_otp } = require('../controllers/authControllers/verifyresetPassOtp');
const { resetPassword } = require('../controllers/authControllers/resetPassword');


const router = express.Router();

router.post("/register", register);
router.post('/verify_otp', verify_otp);
router.post('/resend_otp', resend_otp);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot_password', forgotPassword);
router.post('/verify_reset_otp', verify_reset_pass_otp);
router.post('/reset_password', resetPassword);



module.exports = router;