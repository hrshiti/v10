const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '.env') });

const EmployeeAttendance = require('./models/EmployeeAttendance');

const deleteTodayAttendance = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const result = await EmployeeAttendance.deleteMany({
            date: {
                $gte: today,
                $lt: tomorrow
            }
        });

        console.log(`Deleted ${result.deletedCount} attendance records for today.`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

deleteTodayAttendance();
