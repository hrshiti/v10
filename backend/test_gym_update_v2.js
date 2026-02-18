const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const API_URL = 'http://localhost:5000/api/admin';

async function testUpdate() {
    try {
        console.log('--- Testing Gym Settings Update ---');

        // 1. Login to get fresh token
        console.log('Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'pathanabdulla19997@gmail.com',
            password: 'Abdulla123'
        });

        const token = loginRes.data.token;
        console.log('Login successful! Token acquired.');

        // 2. Try to update gym details (Fetch current first)
        console.log('\nFetching current details...');
        const getRes = await axios.get(`${API_URL}/gym-details`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Current Data:', getRes.data);

        // 3. Perform Update
        console.log('\nAttempting update (without file first)...');
        const updateRes = await axios.put(`${API_URL}/gym-details`, {
            name: 'V-10 Fitness Lab Test',
            contactNumber: '8347008511',
            address: '1st Floor, Rajshree Skyz, Updated',
            gstNo: '24XXXXXTEST'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('✅ Update successful (JSON)!');
        console.log('Updated Data:', updateRes.data);

    } catch (error) {
        console.error('\n❌ ERROR:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

testUpdate();
