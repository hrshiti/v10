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

        console.log('--- VERIFYING DASHBOARD STATS ---');

        // 1. Members
        const active = await Member.countDocuments({ status: 'Active' });
        const expired = await Member.countDocuments({
            $or: [
                { status: 'Expired' },
                { status: 'Active', endDate: { $lt: startOfDay } }
            ]
        });
        const enquiriesUpcoming = await Enquiry.countDocuments({
            commitmentDate: { $gte: startOfDay },
            status: { $ne: 'Closed' }
        });

        console.log(`Members: Active=${active}, Expired=${expired}, UpcomingEnquiries=${enquiriesUpcoming}`);

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

        console.log(`Commitment Dues: Today=${duesToday}, Upcoming(30d)=${duesUpcoming}`);

        // 3. Enquiries (Today)
        const enquiriesToday = await Enquiry.countDocuments({
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });
        console.log(`New Enquiries Today: ${enquiriesToday}`);

        // 4. Financials (Today)
        const salesToday = await Sale.find({ date: { $gte: startOfDay, $lte: endOfDay } });
        const revenueToday = salesToday.reduce((sum, s) => sum + (s.amount || 0), 0);
        const expensesToday = await Expense.find({ date: { $gte: startOfDay, $lte: endOfDay } });
        const totalExpensesToday = expensesToday.reduce((sum, e) => sum + (e.amount || 0), 0);

        console.log(`Financials Today: Revenue=₹${revenueToday}, Expenses=₹${totalExpensesToday}, Profit=₹${revenueToday - totalExpensesToday}`);

        // 5. Check Membership Expiry Report Sync
        // Default range for report: 01-01-2024 to today
        const reportStart = new Date('2024-01-01');
        const reportEnd = endOfDay;

        const reportExpiredCount = await Member.countDocuments({
            $or: [
                { status: 'Expired' },
                { status: 'Active', endDate: { $lt: startOfDay } }
            ],
            endDate: { $gte: reportStart, $lte: reportEnd }
        });

        console.log(`Report Consistency: Expired Count in Report Range (Jan 2024 - Today) = ${reportExpiredCount}`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verifyDashboardStats();
