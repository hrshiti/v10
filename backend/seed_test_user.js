const mongoose = require('mongoose');
const Member = require('./models/Member');
const dotenv = require('dotenv');

dotenv.config();

const createTestMember = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fitness-lab-v10';
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const mobile = '1234567890';
        const existingMember = await Member.findOne({ mobile });

        if (existingMember) {
            console.log('Test member already exists:', existingMember.memberId);
        } else {
            const startDate = new Date();
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + 1);

            const newMember = new Member({
                firstName: 'Test',
                lastName: 'User',
                mobile: mobile,
                email: 'test@example.com',
                gender: 'Male',
                dob: new Date('1990-01-01'),
                address: '123 Test St',
                packageName: 'Gold Monthly',
                status: 'Active',
                startDate: startDate,
                endDate: endDate,
                totalAmount: 1500,
                paidAmount: 1500,
                dueAmount: 0
            });
            await newMember.save();
            console.log('Test member created:', newMember.memberId);
        }

        mongoose.connection.close();
    } catch (error) {
        console.error('Error creating test member:', error);
        process.exit(1);
    }
};

createTestMember();
