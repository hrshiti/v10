const asyncHandler = require('express-async-handler');
const Admin = require('../../models/Admin');
const jwt = require('jsonwebtoken');

// Helper to generate token
const generateToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not defined');
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d',
    });
};

// @desc    Auth admin & get token
// @route   POST /api/admin/auth/login
// @access  Public
const authAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt for email: ${email}`);

    try {
        const admin = await Admin.findOne({ email });

        if (admin && (await admin.matchPassword(password))) {
            console.log('Login successful');
            res.json({
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                token: generateToken(admin._id),
            });
        } else {
            console.log('Invalid credentials');
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        console.error('Error during login process:', error);
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        throw error;
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

// @desc    Save FCM Token
// @route   PUT /api/admin/auth/fcm-token
// @access  Private
const saveFCMToken = asyncHandler(async (req, res) => {
    const { token, platform } = req.body; // platform: 'web' or 'app'
    console.log(`Backend Admin FCM: Request received for platform ${platform}`);

    if (!token) {
        console.error('Backend Admin FCM: Token missing in request body');
        res.status(400);
        throw new Error('Token is required');
    }

    const admin = await Admin.findById(req.admin._id);

    if (admin) {
        if (!admin.fcmTokens) admin.fcmTokens = {};

        if (platform === 'app' || platform === 'mobile') {
            admin.fcmTokens.app = token;
        } else {
            admin.fcmTokens.web = token;
        }

        await admin.save();
        console.log(`Backend Admin FCM: ✅ Token saved for ${admin.email}`);
        res.json({ success: true, message: 'FCM Token saved successfully' });
    } else {
        console.error('Backend Admin FCM: Admin not found');
        res.status(404);
        throw new Error('Admin not found');
    }
});

module.exports = {
    authAdmin,
    registerAdmin,
    forgotPassword,
    saveFCMToken
};
