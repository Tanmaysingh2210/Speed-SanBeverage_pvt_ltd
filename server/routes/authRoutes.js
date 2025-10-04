const express = require('express');
const { register } = require('../controllers/authControllers/register');
const { verify_otp } = require('../controllers/authControllers/verifyOtp');
const { login } = require('../controllers/authControllers/login');
const { resend_otp } = require('../controllers/authControllers/resendOtp');


const router = express.Router();

router.post("/register", register);
router.post('/verify_otp', verify_otp);
router.post('/resend_otp', resend_otp);
router.post('/login', login);



module.exports = router;