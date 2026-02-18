const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const dotenv = require('dotenv');
dotenv.config();

const API_URL = 'http://localhost:5000/api/admin';

async function testFileUpload() {
    try {
        console.log('--- Testing Gym Settings Update (WITH IMAGE) ---');

        // 1. Login
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'pathanabdulla19997@gmail.com',
            password: 'Abdulla123'
        });
        const token = loginRes.data.token;

        // 2. Prepare Form Data
        const form = new FormData();
        form.append('name', 'V-10 Fitness Lab Image Test');
        form.append('contactNumber', '8347008511');
        form.append('address', '1st Floor, Rajshree Skyz');
        form.append('logo', fs.createReadStream('test_logo.png'));

        // 3. Perform Update
        console.log('Uploading image to Cloudinary via API...');
        const response = await axios.put(`${API_URL}/gym-details`, form, {
            headers: {
                ...form.getHeaders(),
                Authorization: `Bearer ${token}`
            }
        });

        console.log('✅ SUCCESS!');
        console.log('Response:', response.data);

    } catch (error) {
        console.error('❌ FAILED:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

testFileUpload();
