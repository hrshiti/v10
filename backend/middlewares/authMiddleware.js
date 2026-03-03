const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Admin = require('../models/Admin');
const Member = require('../models/Member');

const Employee = require('../models/Employee');

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

            // Resilient lookup: prioritize hinted role but check both if needed
            let foundUser = null;
            let finalRole = decoded.role;

            if (decoded.role === 'trainer') {
                foundUser = await Employee.findById(decoded.id).select('-password');
                if (foundUser) {
                    finalRole = 'trainer';
                } else {
                    foundUser = await Member.findById(decoded.id).select('-password');
                    if (foundUser) finalRole = 'member';
                }
            } else if (decoded.role === 'member') {
                foundUser = await Member.findById(decoded.id).select('-password');
                if (foundUser) {
                    finalRole = 'member';
                } else {
                    foundUser = await Employee.findById(decoded.id).select('-password');
                    if (foundUser) finalRole = 'trainer';
                }
            } else {
                // No role in token
                foundUser = await Employee.findById(decoded.id).select('-password');
                if (foundUser) {
                    finalRole = 'trainer';
                } else {
                    foundUser = await Member.findById(decoded.id).select('-password');
                    if (foundUser) finalRole = 'member';
                }
            }

            if (foundUser) {
                req.user = foundUser;
                req.user.role = finalRole;
                next();
            } else {
                console.error(`Auth Error: User not found in DB for ID: ${decoded.id}, Role: ${decoded.role}`);
                res.status(401);
                throw new Error('Not authorized, user not found');
            }
        } catch (error) {
            console.error('Auth Middleware Verification Error:', {
                message: error.message,
                stack: error.stack,
                token: token ? (token.substring(0, 10) + '...') : 'null'
            });
            res.status(401);
            throw new Error(`Not authorized, ${error.message.includes('expired') ? 'token expired' : 'token failed'}`);
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

module.exports = { protect, userProtect };
