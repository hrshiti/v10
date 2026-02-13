const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP, saveFCMToken } = require('../../controllers/user/authController');
const { userProtect } = require('../../middlewares/authMiddleware');

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.put('/fcm-token', userProtect, saveFCMToken);

module.exports = router;
