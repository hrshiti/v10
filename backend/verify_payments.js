const mongoose = require('mongoose');
require('dotenv').config();

const verifyPayments = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const Member = require('./models/Member');
        const Sale = require('./models/Sale');

        console.log('--- PAYMENT VERIFICATION ---');

        // 1. Check Global Member Totals
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
            console.log(`Global Member Totals:`);
            console.log(`Total Value: ₹${m.totalGlobal}`);
            console.log(`Paid Amount: ₹${m.paidGlobal}`);
            console.log(`Due Amount: ₹${m.dueGlobal}`);
            console.log(`Discount Amount: ₹${m.discountGlobal}`);

            const calculatedTotal = m.paidGlobal + m.dueGlobal + m.discountGlobal;
            console.log(`Calculated Total (Paid+Due+Disc): ₹${calculatedTotal}`);
            console.log(`Difference: ₹${m.totalGlobal - calculatedTotal}`);
        }

        // 2. Check Individual Member Consistency
        const inconsistentMembers = await Member.find({
            $expr: {
                $ne: [
                    { $round: ["$totalAmount", 2] },
                    { $round: [{ $add: ["$paidAmount", "$dueAmount", "$discount"] }, 2] }
                ]
            }
        });

        console.log(`\nMembers with inconsistent calculations: ${inconsistentMembers.length}`);
        if (inconsistentMembers.length > 0) {
            inconsistentMembers.slice(0, 5).forEach(m => {
                console.log(`${m.firstName} ${m.lastName}: Total=${m.totalAmount}, Paid=${m.paidAmount}, Due=${m.dueAmount}, Disc=${m.discount} (Diff=${m.totalAmount - (m.paidAmount + m.dueAmount + m.discount)})`);
            });
        }

        // 3. Compare with Sales
        const saleAgg = await Sale.aggregate([
            { $group: { _id: null, totalSaleAmount: { $sum: "$amount" } } }
        ]);
        const totalSales = saleAgg.length > 0 ? saleAgg[0].totalSaleAmount : 0;

        console.log(`\nTotal Collected (from Sales records): ₹${totalSales}`);

        const paidGlobal = memberAgg.length > 0 ? memberAgg[0].paidGlobal : 0;
        console.log(`Total Paid (from Member records): ₹${paidGlobal}`);
        console.log(`Difference (Sales vs Member.paidAmount): ₹${totalSales - paidGlobal}`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verifyPayments();
