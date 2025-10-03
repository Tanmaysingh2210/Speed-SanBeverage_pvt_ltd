const express = require('express');
const { register } = require('../controllers/register');
const { verify_otp } = require('../controllers/verifyOtp');


const router = express.Router();

router.post("/register", register);
router.post('/verify_otp', verify_otp);



module.exports = router;