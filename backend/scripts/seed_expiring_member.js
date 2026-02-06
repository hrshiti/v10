const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Member = require('../models/Member');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async () => {
    console.log('MongoDB Connected');

    // Create a member expiring in 3 days
    const today = new Date();
    const expiryDate = new Date(today);
    expiryDate.setDate(today.getDate() + 3);

    const newMember = {
        firstName: 'Test',
        lastName: 'Expiring',
        mobile: '9876543210',
        email: 'test.expiring@example.com',
        memberId: 'EXTest001',
        status: 'Active',
        packageName: 'Gold Membership',
        durationMonths: 1,
        startDate: new Date(),
        endDate: expiryDate,
        amount: 5000,
        paidAmount: 5000,
        dueAmount: 0,
        paymentMode: 'Cash',
        admissionDate: new Date(),
    };

    try {
        await Member.create(newMember);
        console.log('Seeded expiring member: Test Expiring');
    } catch (error) {
        console.error('Error seeding member:', error);
    }
    
    process.exit();
}).catch(err => {
    console.error(err);
    process.exit(1);
});
