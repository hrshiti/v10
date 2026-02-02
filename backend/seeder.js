const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await Admin.deleteMany();

        const adminUser = {
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123', // Will be hashed by pre-save hook
            role: 'admin',
        };

        await Admin.create(adminUser);

        console.log('Admin Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    // destroyData();
} else {
    importData();
}
