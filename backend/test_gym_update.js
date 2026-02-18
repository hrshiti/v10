const mongoose = require('mongoose');
const GymDetail = require('./models/GymDetail');
require('dotenv').config();

async function testUpdate() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('DB Connected');

        // Try to find
        let gym = await GymDetail.findOne();
        console.log('Current Gym:', gym);

        if (gym) {
            gym.name = "Test Gym " + Date.now();
            await gym.save();
            console.log('Updated Gym:', gym);
        } else {
            gym = await GymDetail.create({
                name: "Initial Gym",
                contactNumber: "1234567890",
                address: "Test Address"
            });
            console.log('Created Gym:', gym);
        }
        process.exit(0);
    } catch (err) {
        console.error('Test Failed:', err);
        process.exit(1);
    }
}

testUpdate();
