const mongoose = require('mongoose');
require('dotenv').config();

const verifyDashboardStats = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const Member = require('./models/Member');
        const Enquiry = require('./models/Enquiry');
        const Sale = require('./models/Sale');
        const Expense = require('./models/Expense');

        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        const endOfDay = new Date(now.setHours(23, 59, 59, 999));
        const next30 = new Date(startOfDay);
        next30.setDate(next30.getDate() + 30);
        next30.setHours(23, 59, 59, 999);

        console.log('--- VERIFICATION START ---');

        // 1. Members
        const active = await Member.countDocuments({ status: 'Active' });
        const expiredLogic = {
            $or: [
                { status: 'Expired' },
                { status: 'Active', endDate: { $lt: startOfDay } }
            ]
        };
        const expired = await Member.countDocuments(expiredLogic);
        const enquiriesUpcoming = await Enquiry.countDocuments({
            commitmentDate: { $gte: startOfDay },
            status: { $ne: 'Closed' }
        });

        console.log(`Active Members: ${active}`);
        console.log(`Expired Members (Logic): ${expired}`);
        console.log(`Upcoming Enquiries: ${enquiriesUpcoming}`);

        // 2. Commitment Dues
        const duesToday = await Member.countDocuments({
            dueAmount: { $gt: 0 },
            $or: [
                { commitmentDate: { $lte: endOfDay } },
                { commitmentDate: { $exists: false } },
                { commitmentDate: null }
            ]
        });

        const duesUpcoming = await Member.countDocuments({
            dueAmount: { $gt: 0 },
            $or: [
                { commitmentDate: { $lte: next30 } },
                { commitmentDate: { $exists: false } },
                { commitmentDate: null }
            ]
        });

        console.log(`Commitment Dues Today: ${duesToday}`);
        console.log(`Commitment Dues 30d: ${duesUpcoming}`);

        // 3. Financials
        const salesToday = await Sale.find({ date: { $gte: startOfDay, $lte: endOfDay } });
        const revenueToday = salesToday.reduce((sum, s) => sum + (s.amount || 0), 0);
        console.log(`Revenue Today: ₹${revenueToday}`);

        // 4. Report Consistency check
        const todayStr = now.toISOString().split('T')[0];
        const next30Str = next30.toISOString().split('T')[0];

        // Count for Expiring Soon (Report style - Agle 30 din)
        const expiringSoonCount = await Member.countDocuments({
            status: 'Active',
            endDate: { $gte: startOfDay, $lte: next30 }
        });
        console.log(`Expiring Soon (Next 30 Days): ${expiringSoonCount}`);

        console.log('--- VERIFICATION END ---');

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verifyDashboardStats();
