const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Member = require('./models/Member');
const Subscription = require('./models/Subscription');
const Sale = require('./models/Sale');

const fixSpecificMember = async (memberIdStr) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`Fixing Member: ${memberIdStr}...`);

        const member = await Member.findOne({ memberId: memberIdStr });
        if (!member) {
            console.log('Member not found');
            return;
        }

        // 1. Delete Duplicate Subscriptions (Same Package, Same Day, same member)
        const subs = await Subscription.find({ memberId: member._id }).sort({ createdAt: 1 });
        const toDeleteSubIds = [];
        const seen = new Set();

        subs.forEach(sub => {
            const dayKey = `${sub.packageId}_${sub.startDate.toISOString().split('T')[0]}_${sub.paidAmount}`;
            if (seen.has(dayKey)) {
                toDeleteSubIds.push(sub._id);
            } else {
                seen.add(dayKey);
            }
        });

        if (toDeleteSubIds.length > 0) {
            await Subscription.deleteMany({ _id: { $in: toDeleteSubIds } });
            console.log(`Deleted ${toDeleteSubIds.length} duplicate subscriptions.`);
        }

        // 2. Re-calculate Member Totals from SALES
        const sales = await Sale.find({ memberId: member._id });
        const totalPaid = sales.reduce((acc, s) => acc + s.amount, 0);

        // Let's assume the LATEST current subscription's package rate is the intended commitment
        const currentSub = await Subscription.findOne({ memberId: member._id, isCurrent: true }).populate('packageId');

        // This is complex because totalAmount is cumulative. 
        // But we definitely want to fix the bloated dues.
        // Let's reset member.paidAmount to match sales exactly.
        member.paidAmount = totalPaid;

        // Fix totalAmount: It should be (Sum of all completed subscriptions' prices)
        // For simplicity: member.dueAmount = (member.totalAmount - member.paidAmount)
        // If totalAmount is wrong, dueAmount is wrong.

        // Let's recalculate totalAmount by looking at non-duplicate subscriptions
        const uniqueSubs = await Subscription.find({ memberId: member._id }).populate('packageId');
        const calculatedTotalAmount = uniqueSubs.reduce((acc, sub) => acc + (sub.packageId?.baseRate || 0), 0);

        member.totalAmount = calculatedTotalAmount;
        member.dueAmount = Math.max(0, member.totalAmount - (member.paidAmount + member.discount));

        await member.save();
        console.log(`Final Profile Fix: Total=${member.totalAmount}, Paid=${member.paidAmount}, Due=${member.dueAmount}`);

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

fixSpecificMember('M93389'); // John Doe's ID from screenshot
