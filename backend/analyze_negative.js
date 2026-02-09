const mongoose = require('mongoose');
const Member = require('./models/Member');
require('dotenv').config();

const test = async () => {
    try {
        await mongoose.connect('mongodb+srv://mayurchadokar14:Mayur123@cluster0.uc7l30b.mongodb.net/v10');

        const negativeMembers = await Member.find({
            dueAmount: { $lt: 0 }
        }).select('firstName lastName totalAmount paidAmount dueAmount discount commitmentDate');

        console.log('--- NEGATIVE DUES ANALYSIS ---');
        negativeMembers.forEach(m => {
            console.log(`\n${m.firstName} ${m.lastName}`);
            console.log(`Total: ₹${m.totalAmount}`);
            console.log(`Paid:  ₹${m.paidAmount}`);
            console.log(`Disc:  ₹${m.discount}`);
            console.log(`Due:   ₹${m.dueAmount}`);
            const calc = Number(m.totalAmount) - (Number(m.paidAmount) + Number(m.discount || 0));
            console.log(`Calc:  ₹${calc}`);
        });

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

test();
