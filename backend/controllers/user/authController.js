const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const Member = require('../../models/Member');

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
    const member = await Member.findOne({ mobile });

    if (!member) {
        res.status(404);
        throw new Error('Member not found with this mobile number. Please register or contact admin.');
    }

    // In a real app, send OTP via SMS service
    // For now, we simulate success
    res.status(200).json({
        success: true,
        message: 'OTP sent successfully (Simulated)',
        // For development convenience, we can return the OTP or just assume 123456
        otp: '123456'
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
    const member = await Member.findOne({ mobile });

    if (!member) {
        res.status(404);
        throw new Error('Member not found');
    }

    // Validate OTP (Simple check for demo)
    if (otp !== '123456') {
        res.status(401);
        throw new Error('Invalid OTP');
    }

    // Generate JWT
    const token = jwt.sign(
        { id: member._id, role: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );

    res.json({
        _id: member._id,
        firstName: member.firstName,
        lastName: member.lastName,
        mobile: member.mobile,
        memberId: member.memberId,
        token
    });
});

module.exports = {
    sendOTP,
    verifyOTP
};
