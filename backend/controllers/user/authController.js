const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const Member = require('../../models/Member');
const Employee = require('../../models/Employee');
const Otp = require('../../models/Otp');
const sendSms = require('../../utils/smsIndiaHub');

// @desc    Send OTP to mobile
// @route   POST /api/user/auth/send-otp
// @access  Public
const sendOTP = asyncHandler(async (req, res) => {
    const { mobile } = req.body;

    if (!mobile) {
        res.status(400);
        throw new Error('Mobile number is required');
    }

    // Check if member exists
    let user = await Member.findOne({ mobile });
    let role = 'member';

    // If not member, check if employee (Trainer)
    if (!user) {
        user = await Employee.findOne({ mobile });
        if (user) {
            role = 'trainer';
        }
    }

    if (!user) {
        res.status(404);
        throw new Error('User not found with this mobile number. Please register or contact admin.');
    }

    if (role === 'member' && user.isBlocked) {
        res.status(403);
        throw new Error('Your account has been blocked. Please contact admin.');
    }

    // Generate 6 digit OTP or use default for specific number
    let otp;
    if (mobile === '6260491554') {
        otp = '123456';
    } else {
        otp = Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Save OTP to DB (upsert)
    await Otp.findOneAndUpdate(
        { mobile },
        { otp, createdAt: Date.now() },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Send SMS via SMS India Hub only if NOT the default number
    if (mobile !== '6260491554') {
        const message = `Welcome to the V10 gym powered by SMSINDIAHUB. Your OTP for registration is ${otp}`;
        await sendSms(mobile, message);
    }

    res.status(200).json({
        success: true,
        message: 'OTP sent successfully'
    });
});

// @desc    Verify OTP and login
// @route   POST /api/user/auth/verify-otp
// @access  Public
const verifyOTP = asyncHandler(async (req, res) => {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
        res.status(400);
        throw new Error('Mobile and OTP are required');
    }

    // Check if member exists
    let user = await Member.findOne({ mobile });
    let role = 'member';

    if (!user) {
        user = await Employee.findOne({ mobile });
        if (user) {
            role = 'trainer';
        }
    }

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (role === 'member' && user.isBlocked) {
        res.status(403);
        throw new Error('Your account has been blocked. Please contact admin.');
    }

    // Verify OTP
    const otpRecord = await Otp.findOne({ mobile });

    if (!otpRecord) {
        res.status(400);
        throw new Error('OTP expired or not found. Please request a new one.');
    }

    if (otpRecord.otp !== otp) {
        res.status(400);
        throw new Error('Invalid OTP');
    }

    // Clear OTP after successful verification
    await Otp.deleteOne({ mobile });

    // Generate JWT
    const token = jwt.sign(
        { id: user._id, role: role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        mobile: user.mobile,
        photo: user.photo,
        memberId: user.memberId || user.employeeId,
        role: role,
        token
    });
});

// @desc    Save FCM Token
// @route   PUT /api/user/auth/fcm-token
// @access  Private
const saveFCMToken = asyncHandler(async (req, res) => {
    const { token, platform } = req.body;
    console.log(`Backend User FCM: Request received for platform ${platform}`);

    if (!token) {
        console.error('Backend User FCM: Token missing in request body');
        res.status(400);
        throw new Error('Token is required');
    }

    let user = await Member.findById(req.user._id);

    // If not member, check if employee (Trainer)
    if (!user) {
        user = await Employee.findById(req.user._id);
    }

    if (user) {
        console.log(`Backend User FCM: Found user ${user.firstName} ${user.lastName}`);
        if (!user.fcmTokens) user.fcmTokens = {};

        if (platform === 'app' || platform === 'mobile') {
            user.fcmTokens.app = token;
        } else {
            user.fcmTokens.web = token;
        }

        await user.save();
        console.log(`Backend User FCM: ✅ Token saved successfully`);
        res.json({ success: true, message: 'FCM Token saved successfully' });
    } else {
        console.error('Backend User FCM: User not found in database');
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = {
    sendOTP,
    verifyOTP,
    saveFCMToken
};
