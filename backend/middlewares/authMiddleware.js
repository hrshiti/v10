const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Admin = require('../models/Admin');
const Member = require('../models/Member');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            if (!process.env.JWT_SECRET) {
                throw new Error('JWT_SECRET environment variable is not defined');
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.admin = await Admin.findById(decoded.id).select('-password');
            if (req.admin) {
                next();
            } else {
                res.status(401);
                throw new Error('Not authorized as admin');
            }
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

const userProtect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            if (!process.env.JWT_SECRET) {
                throw new Error('JWT_SECRET environment variable is not defined');
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await Member.findById(decoded.id);
            if (req.user) {
                next();
            } else {
                res.status(401);
                throw new Error('Not authorized as user');
            }
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

module.exports = { protect, userProtect };
