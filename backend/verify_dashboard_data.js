const mongoose = require('mongoose');
const Member = require('./models/Member');
const Sale = require('./models/Sale');
const Enquiry = require('./models/Enquiry');
const MemberAttendance = require('./models/MemberAttendance');
const dotenv = require('dotenv');

dotenv.config();

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gym-management');
        console.log('Connected to MongoDB');

        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        // 1. Members
        const active = await Member.countDocuments({ status: 'Active' });
        const upcoming = await Enquiry.countDocuments({
            commitmentDate: { $gte: startOfDay },
            status: { $ne: 'Closed' }
        });
        console.log('--- Members Overview ---');
        console.log(`Active: ${active}`);
        console.log(`Upcoming (Enquiries): ${upcoming}`);

        // 2. Commitment Dues
        const next30Days = new Date();
        next30Days.setDate(today.getDate() + 30);

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
            commitmentDate: { $gt: endOfDay, $lte: next30Days }
        });
        console.log('--- Commitment Dues ---');
        console.log(`Today: ${duesToday}`);
        console.log(`Upcoming (30 days): ${duesUpcoming}`);

        // 3. Financials
        const sales = await Sale.find({});
        let totalCash = 0;
        let saleCount = 0;
        let breakdown = {
            fresh: { n: 0, v: 0 },
            renewal: { n: 0, v: 0 },
            ptFresh: { n: 0, v: 0 },
            ptRenewal: { n: 0, v: 0 }
        };

        sales.forEach(s => {
            totalCash += (s.amount || 0);
            saleCount++;

            const isPT = s.membershipType === 'Personal Training';
            const val = s.subTotal ? (s.subTotal + (s.taxAmount || 0) - (s.discountAmount || 0)) : s.amount;

            if (isPT) {
                if (s.type === 'New Membership' || s.type === 'PT') {
                    breakdown.ptFresh.n++;
                    breakdown.ptFresh.v += val;
                } else if (s.type === 'Renewal' || s.type === 'PT Renewal') {
                    breakdown.ptRenewal.n++;
                    breakdown.ptRenewal.v += val;
                }
            } else {
                if (s.type === 'New Membership') {
                    breakdown.fresh.n++;
                    breakdown.fresh.v += val;
                } else if (s.type === 'Renewal') {
                    breakdown.renewal.n++;
                    breakdown.renewal.v += val;
                }
            }
        });

        console.log('--- Sales Stats ---');
        console.log(`Total Sales Count: ${saleCount}`);
        console.log(`Total Cash Collected (Revenue): ${totalCash}`);
        console.log('Breakdown (Booking Values):');
        console.log(`Fresh: ${breakdown.fresh.n} | ${breakdown.fresh.v}`);
        console.log(`Renewal: ${breakdown.renewal.n} | ${breakdown.renewal.v}`);
        console.log(`PT Fresh: ${breakdown.ptFresh.n} | ${breakdown.ptFresh.v}`);
        console.log(`PT Renewal: ${breakdown.ptRenewal.n} | ${breakdown.ptRenewal.v}`);

        // 4. Balance Payment
        const members = await Member.find({});
        let totalPaidInMembers = 0;
        let totalDueInMembers = 0;
        members.forEach(m => {
            totalPaidInMembers += (m.paidAmount || 0);
            totalDueInMembers += (m.dueAmount || 0);
        });
        console.log('--- Balance Payment ---');
        console.log(`Paid (Member Summary): ${totalPaidInMembers}`);
        console.log(`Due (Member Summary): ${totalDueInMembers}`);

        // 5. Chart Trend Analysis (Current Year)
        console.log('\n--- Chart Trend Analysis (Current Year) ---');
        const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const endOfYear = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59);

        // New Joins (Sales: New Membership)
        const newJoins = await Sale.aggregate([
            { $match: { date: { $gte: startOfYear, $lte: endOfYear }, type: 'New Membership' } },
            { $group: { _id: { $month: "$date" }, count: { $sum: 1 } } }
        ]);

        // Renewals (Sales: Renewal)
        const renewals = await Sale.aggregate([
            { $match: { date: { $gte: startOfYear, $lte: endOfYear }, type: 'Renewal' } },
            { $group: { _id: { $month: "$date" }, count: { $sum: 1 } } }
        ]);

        // Expiries (Member: endDate)
        const expiries = await Member.aggregate([
            { $match: { endDate: { $gte: startOfYear, $lte: endOfYear } } },
            { $group: { _id: { $month: "$endDate" }, count: { $sum: 1 } } }
        ]);

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        console.log('Month | New Joins | Renewals | Expiries');
        monthNames.forEach((m, i) => {
            const monthNum = i + 1;
            const nj = newJoins.find(j => j._id === monthNum)?.count || 0;
            const rn = renewals.find(r => r._id === monthNum)?.count || 0;
            const ex = expiries.find(e => e._id === monthNum)?.count || 0;
            if (nj > 0 || rn > 0 || ex > 0) {
                console.log(`${m.padEnd(5)} | ${nj.toString().padEnd(9)} | ${rn.toString().padEnd(8)} | ${ex}`);
            }
        });

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

verify();
