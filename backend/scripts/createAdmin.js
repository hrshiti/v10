const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        const name = 'V10 Admin';
        const email = 'v10admin@gmail.com';
        const password = 'v10admin@123'; // New admin password

        const adminExists = await Admin.findOne({ email });

        if (adminExists) {
            console.log('Admin already exists with this email.');
            process.exit();
        }

        const admin = await Admin.create({
            name,
            email,
            password,
        });

        if (admin) {
            console.log('Admin created successfully!');
            console.log('Email:', email);
            console.log('Password:', password);
        } else {
            console.log('Invalid admin data');
        }

        process.exit();
    } catch (error) {
        console.error('Error creating admin:', error.message);
        process.exit(1);
    }
};

createAdmin();
