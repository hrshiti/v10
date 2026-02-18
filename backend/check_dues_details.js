const mongoose = require('mongoose');
require('dotenv').config();

const checkDues = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const Member = require('./models/Member');

        const dueMembers = await Member.find({ dueAmount: { $gt: 0 } })
            .select('firstName lastName totalAmount paidAmount discount dueAmount')
            .limit(10);

        console.log(`Total members with Due Amount > 0: ${await Member.countDocuments({ dueAmount: { $gt: 0 } })}`);

        if (dueMembers.length > 0) {
            console.log('\nSample records with Dues:');
            dueMembers.forEach(m => {
                console.log(`${m.firstName} ${m.lastName}: Total=${m.totalAmount}, Paid=${m.paidAmount}, Disc=${m.discount}, Due=${m.dueAmount}`);
            });
        }

        const totals = await Member.aggregate([
            {
                $group: {
                    _id: null,
                    totalPending: { $sum: "$dueAmount" }
                }
            }
        ]);
        console.log(`\nTotal Balance Payment (Pending) on Dashboard: ₹${totals[0]?.totalPending || 0}`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkDues();
