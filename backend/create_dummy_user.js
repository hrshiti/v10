const mongoose = require('mongoose');
const Member = require('./models/Member');
const dotenv = require('dotenv');

dotenv.config();

const createDummyUser = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            console.error('MONGO_URI is not defined in .env');
            process.exit(1);
        }

        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const mobile = '9039732315';
        const existingMember = await Member.findOne({ mobile });

        if (existingMember) {
            console.log('Dummy user already exists:', existingMember.memberId);
            // Update to ensure status is active and date is future
            const futureDate = new Date();
            futureDate.setFullYear(futureDate.getFullYear() + 10);

            existingMember.status = 'Active';
            existingMember.endDate = futureDate;
            existingMember.lastName = 'Test User (Dummy)';
            await existingMember.save();
            console.log('Dummy user updated to active status.');
        } else {
            const startDate = new Date();
            const endDate = new Date();
            endDate.setFullYear(endDate.getFullYear() + 10); // 10 years access

            const newMember = new Member({
                firstName: 'Dummy',
                lastName: 'Test User',
                mobile: mobile,
                email: 'dummy_test@v10fitness.in',
                gender: 'Other',
                dob: new Date('2000-01-01'),
                address: 'Test Address',
                packageNameStatic: 'Lifetime Access (Test)',
                status: 'Active',
                startDate: startDate,
                endDate: endDate,
                totalAmount: 0,
                paidAmount: 0,
                discount: 0,
                dueAmount: 0,
                createdBy: 'System-Admin-Seed'
            });

            await newMember.save();
            console.log('Dummy test member created successfully:', newMember.memberId);
            console.log('Mobile Number:', mobile);
        }

        mongoose.connection.close();
    } catch (error) {
        console.error('Error creating dummy user:', error);
        process.exit(1);
    }
};

createDummyUser();
