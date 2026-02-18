const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const axios = require('axios');
require('dotenv').config();

async function runTest() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const admin = await Admin.findOne({ email: 'pathanbadulla19997@gmail.com' });
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log('Testing PUT /api/admin/gym-details...');
        try {
            const res = await axios.put('http://localhost:5000/api/admin/gym-details', {
                name: 'V-10 Fitness Updated',
                contactNumber: '8347008511',
                address: 'Test Address'
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Success:', res.data);
        } catch (err) {
            console.error('Error Status:', err.response?.status);
            console.error('Error Data:', err.response?.data);
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

runTest();
