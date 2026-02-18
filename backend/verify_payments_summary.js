const mongoose = require('mongoose');
require('dotenv').config();

const verifyPayments = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const Member = require('./models/Member');

        const memberAgg = await Member.aggregate([
            {
                $group: {
                    _id: null,
                    totalGlobal: { $sum: "$totalAmount" },
                    paidGlobal: { $sum: "$paidAmount" },
                    dueGlobal: { $sum: "$dueAmount" },
                    discountGlobal: { $sum: "$discount" }
                }
            }
        ]);

        if (memberAgg.length > 0) {
            const m = memberAgg[0];
            console.log('--- SUMMARY ---');
            console.log(`Paid Global: ₹${m.paidGlobal}`);
            console.log(`Due Global: ₹${m.dueGlobal}`);
            console.log(`Total Value: ₹${m.totalGlobal}`);
            console.log(`Discount: ₹${m.discountGlobal}`);
            console.log(`Combined (P+D+D): ₹${m.paidGlobal + m.dueGlobal + m.discountGlobal}`);
            console.log(`Mismatch: ₹${m.totalGlobal - (m.paidGlobal + m.dueGlobal + m.discountGlobal)}`);
        }

        const countMismatch = await Member.countDocuments({
            $expr: {
                $ne: [
                    { $round: ["$totalAmount", 2] },
                    { $round: [{ $add: ["$paidAmount", "$dueAmount", "$discount"] }, 2] }
                ]
            }
        });
        console.log(`Inconsistent Individual Records: ${countMismatch}`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verifyPayments();
