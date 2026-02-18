const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

dotenv.config();

const findAdmin = async () => {
    try {
        await connectDB();
        const admins = await Admin.find({});
        console.log('Current Admins:');
        admins.forEach(admin => {
            console.log(`Name: ${admin.name}, Email: ${admin.email}, Role: ${admin.role}`);
        });
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

findAdmin();
