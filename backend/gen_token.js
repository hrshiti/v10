const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
require('dotenv').config();

async function generateToken() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const admin = await Admin.findOne({ email: 'pathanbadulla19997@gmail.com' });
        if (!admin) {
            console.log('Admin not found');
            process.exit(1);
        }
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE || '30d',
        });
        console.log('Token:', token);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

generateToken();
