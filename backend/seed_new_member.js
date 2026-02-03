const mongoose = require('mongoose');
const Member = require('./models/Member');
const dotenv = require('dotenv');

dotenv.config();

const seedNewMember = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for Seeding...');

        const mobile = '9876543210';

        // Check if exists
        const existing = await Member.findOne({ mobile });
        if (existing) {
            console.log('Member already exists with mobile:', mobile);
            process.exit(0);
        }

        const newMember = new Member({
            firstName: 'Aman',
            lastName: 'Sharma',
            mobile: mobile,
            email: 'aman@example.com',
            gender: 'Male',
            packageName: 'Monthly Pro',
            totalAmount: 5000,
            paidAmount: 5000,
            startDate: new Date(),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            status: 'Active',
            weight: 80,
            height: 180,
            age: 25
        });

        await newMember.save();
        console.log('\n✅ New Member Created Successfully!');
        console.log('-----------------------------------');
        console.log('Name: Aman Sharma');
        console.log('Mobile:', mobile);
        console.log('OTP (Simulated): 123456');
        console.log('-----------------------------------');
        console.log('You can now use this mobile to login in the app.');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding member:', error);
        process.exit(1);
    }
};

seedNewMember();
