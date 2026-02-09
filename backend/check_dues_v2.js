const mongoose = require('mongoose');
const Member = require('./models/Member');
require('dotenv').config();

const test = async () => {
    try {
        await mongoose.connect('mongodb+srv://mayurchadokar14:Mayur123@cluster0.uc7l30b.mongodb.net/v10');
        console.log('Connected');

        const withDate = await Member.countDocuments({
            commitmentDate: { $exists: true, $ne: null }
        });
        console.log('Members with commitmentDate set:', withDate);

        const samples = await Member.find({
            dueAmount: { $lt: 0 }
        }).select('firstName lastName totalAmount paidAmount dueAmount discount commitmentDate').limit(5);

        console.log('Detailed Financial Analysis:');
        samples.forEach(m => {
            console.log(`\nMember: ${m.firstName} ${m.lastName}`);
            console.log(`- Total Amount: ₹${m.totalAmount}`);
            console.log(`- Paid Amount:  ₹${m.paidAmount}`);
            console.log(`- Discount:     ₹${m.discount}`);
            console.log(`- Due Amount:   ₹${m.dueAmount}`);
            console.log(`- Calculated:   ₹${m.totalAmount - (m.paidAmount + (m.discount || 0))} (Total - (Paid + Discount))`);
        });

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

test();
