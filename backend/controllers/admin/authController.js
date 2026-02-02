const asyncHandler = require('express-async-handler');
const Admin = require('../../models/Admin');
const jwt = require('jsonwebtoken');

// Helper to generate token
const generateToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not defined');
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Auth admin & get token
// @route   POST /api/admin/auth/login
// @access  Public
const authAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
        res.json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            token: generateToken(admin._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Register a new admin (Dev only or superadmin)
// @route   POST /api/admin/auth/register
// @access  Public (for initial setup)
const registerAdmin = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
        res.status(400);
        throw new Error('Admin already exists');
    }

    const admin = await Admin.create({
        name,
        email,
        password,
    });

    if (admin) {
        res.status(201).json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            token: generateToken(admin._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid admin data');
    }
});

// @desc    Forgot Password (Mock)
// @route   POST /api/admin/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
        res.status(404);
        throw new Error('User not found');
    }

    // In a real app, send email here.
    res.json({ message: `Password reset link sent to ${email}` });
});

module.exports = {
    authAdmin,
    registerAdmin,
    forgotPassword
};
