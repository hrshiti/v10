const mongoose = require('mongoose');
require('dotenv').config();

const analyzePayments = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const Member = require('./models/Member');

        const stats = await Member.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                    paid: { $sum: "$paidAmount" },
                    due: { $sum: "$dueAmount" }
                }
            }
        ]);

        console.log('--- Payment Analysis by Status ---');
        stats.forEach(s => {
            console.log(`Status: ${s._id}, Count: ${s.count}, Paid: ₹${s.paid}, Due: ₹${s.due}`);
        });

        const total = await Member.aggregate([
            {
                $group: {
                    _id: null,
                    totalPaid: { $sum: "$paidAmount" },
                    totalDue: { $sum: "$dueAmount" }
                }
            }
        ]);

        console.log('\n--- Overall ---');
        console.log(`Total Paid: ₹${total[0].totalPaid}`);
        console.log(`Total Due: ₹${total[0].totalDue}`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

analyzePayments();
