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

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to DB (upsert)
    await Otp.findOneAndUpdate(
        { mobile },
        { otp, createdAt: Date.now() },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Send SMS via SMS India Hub
    const message = `Welcome to the V10 gym powered by SMSINDIAHUB. Your OTP for registration is ${otp};`;
    const result = await sendSms(mobile, message);

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

module.exports = {
    sendOTP,
    verifyOTP
};
