const asyncHandler = require('express-async-handler');
const Member = require('../../models/Member');
const FollowUp = require('../../models/FollowUp');
const Sale = require('../../models/Sale');
const Expense = require('../../models/Expense');

// @desc    Get Dashboard Statistics (Cards)
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
const MemberAttendance = require('../../models/MemberAttendance');

// @desc    Get Dashboard Statistics (Cards)
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
    // Helper for Start/End of Day
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // 1. Members
    const activeMembers = await Member.countDocuments({ status: 'Active' });
    const upcomingMembers = await Member.countDocuments({ status: { $in: ['Upcoming', 'Pending'] } });

    // 2. Follow Ups
    const totalFollowUps = await FollowUp.countDocuments({});
    const doneFollowUps = await FollowUp.countDocuments({ isDone: true });

    // 3. Enquiries (Last 30 days new enquiries)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newEnquiries = await require('../../models/Enquiry').countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
    });

    // 4. Financials (Total Revenue via Aggregation) & Sales Breakdown
    const salesStats = await Sale.aggregate([
        {
            $group: {
                _id: "$type",
                count: { $sum: 1 },
                amount: { $sum: "$amount" }
            }
        }
    ]);

    let totalRevenue = 0;
    let totalSalesCount = 0;
    let freshSales = { number: 0, amount: 0 };
    let renewalSales = { number: 0, amount: 0 };
    let ptSales = { number: 0, amount: 0 };
    let ptRenewalSales = { number: 0, amount: 0 };
    let upgradeSales = { number: 0, amount: 0 };
    let transferSales = { number: 0, amount: 0 };

    salesStats.forEach(stat => {
        totalRevenue += stat.amount;
        totalSalesCount += stat.count;

        switch (stat._id) {
            case 'New Membership':
                freshSales = { number: stat.count, amount: stat.amount };
                break;
            case 'Renewal':
                renewalSales = { number: stat.count, amount: stat.amount };
                break;
            case 'PT':
                ptSales = { number: stat.count, amount: stat.amount };
                break;
            case 'PT Renewal':
                ptRenewalSales = { number: stat.count, amount: stat.amount };
                break;
            case 'Upgrade':
                upgradeSales = { number: stat.count, amount: stat.amount };
                break;
            case 'Transfer':
                transferSales = { number: stat.count, amount: stat.amount };
                break;
        }
    });

    // 5. Payment Stats (Paid vs Due)
    // Paid Amount -> Sum of Member.paidAmount
    const paidAgg = await Member.aggregate([
        { $group: { _id: null, totalPaid: { $sum: "$paidAmount" } } }
    ]);
    const paidAmount = paidAgg.length > 0 ? paidAgg[0].totalPaid : 0;

    // Due Amount -> Sum of Member.dueAmount
    const dueAgg = await Member.aggregate([
        { $group: { _id: null, totalDue: { $sum: "$dueAmount" } } }
    ]);
    const pendingPayment = dueAgg.length > 0 ? dueAgg[0].totalDue : 0;


    // 6. Attendance Stats
    const presentCount = await MemberAttendance.countDocuments({
        date: { $gte: startOfDay, $lte: endOfDay },
        status: 'Present'
    });
    const absentCount = Math.max(0, activeMembers - presentCount);

    // Birthdays & Anniversaries (Today)
    const todayDay = new Date().getDate();
    const todayMonth = new Date().getMonth() + 1;

    const birthdayCountArr = await Member.aggregate([
        { $project: { month: { $month: "$dob" }, day: { $dayOfMonth: "$dob" } } },
        { $match: { month: todayMonth, day: todayDay } }
    ]);

    // Using admissionDate for Anniversary
    const anniversaryCountArr = await Member.aggregate([
        { $project: { month: { $month: "$admissionDate" }, day: { $dayOfMonth: "$admissionDate" } } },
        { $match: { month: todayMonth, day: todayDay } }
    ]);


    const stats = {
        members: {
            active: activeMembers,
            upcoming: upcomingMembers
        },
        followUps: {
            total: totalFollowUps,
            done: doneFollowUps
        },
        enquiries: {
            new: newEnquiries,
            sales: freshSales.number // Approximation: New Membership Sales
        },
        attendance: {
            present: presentCount,
            absent: absentCount,
            birthday: birthdayCountArr.length,
            anniversary: anniversaryCountArr.length
        },
        financial: {
            totalRevenue,
            totalSalesCount,
            paidAmount,
            pendingPayment,
            totalExpenses: 0
        },
        sales: {
            fresh: freshSales,
            renewal: renewalSales,
            pt: ptSales,
            ptRenewal: ptRenewalSales,
            upgrade: upgradeSales,
            transfer: transferSales
        }
    };

    res.json(stats);
});

// @desc    Get Recent Follow Ups
// @route   GET /api/admin/dashboard/follow-ups
// @access  Private/Admin
const getRecentFollowUps = asyncHandler(async (req, res) => {
    // Limit to 5 for dashboard view
    const followUps = await FollowUp.find({ isDone: false })
        .sort({ dateTime: 1 })
        .limit(50);

    res.json(followUps);
});

// @desc    Get Financial/Chart Data
// @route   GET /api/admin/dashboard/charts
// @access  Private/Admin
const getDashboardCharts = asyncHandler(async (req, res) => {
    // 1. Lead Types
    const leadTypeStats = await require('../../models/Enquiry').aggregate([
        { $group: { _id: "$leadType", count: { $sum: 1 } } }
    ]);
    const colors = { 'Hot': '#ef4444', 'Warm': '#f97316', 'Cold': '#0ea5e9' };
    const leadTypes = leadTypeStats.map(stat => ({
        name: stat._id || 'Unknown',
        value: stat.count,
        color: colors[stat._id] || '#cbd5e1'
    }));

    // 2. Prepare Ranges (Current Year)
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const endOfQuery = new Date(); // Limit to today to avoid showing future data (e.g. future expiries)

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Initialize Maps
    const memberTrendMap = months.map(m => ({ name: m, active: 0, inactive: 0, upcoming: 0 }));
    const financialMap = months.map(m => ({ name: m, revenue: 0, pending: 0, expenses: 0, profit: 0 }));

    // 3. Member Trend Data
    // Active -> New Sales
    const newSales = await Sale.aggregate([
        { $match: { date: { $gte: startOfYear, $lte: endOfQuery }, type: 'New Membership' } },
        { $group: { _id: { $month: "$date" }, count: { $sum: 1 } } }
    ]);
    newSales.forEach(s => { if (s._id) memberTrendMap[s._id - 1].active = s.count; });

    // Upcoming -> Renewals (Legend says Renewal)
    const renewals = await Sale.aggregate([
        { $match: { date: { $gte: startOfYear, $lte: endOfQuery }, type: 'Renewal' } },
        { $group: { _id: { $month: "$date" }, count: { $sum: 1 } } }
    ]);
    renewals.forEach(s => { if (s._id) memberTrendMap[s._id - 1].upcoming = s.count; });

    // Inactive -> Expiries (Past/Present only)
    const expiries = await Member.aggregate([
        { $match: { endDate: { $gte: startOfYear, $lte: endOfQuery } } },
        { $group: { _id: { $month: "$endDate" }, count: { $sum: 1 } } }
    ]);
    expiries.forEach(s => { if (s._id) memberTrendMap[s._id - 1].inactive = s.count; });

    // 4. Financial Data
    // Revenue -> All Sales sums
    const revenue = await Sale.aggregate([
        { $match: { date: { $gte: startOfYear, $lte: endOfQuery } } },
        { $group: { _id: { $month: "$date" }, total: { $sum: "$amount" } } }
    ]);
    revenue.forEach(r => { if (r._id) financialMap[r._id - 1].revenue = r.total; });

    // Expenses -> All Expenses sums
    const expenses = await Expense.aggregate([
        { $match: { date: { $gte: startOfYear, $lte: endOfQuery }, isDeleted: false } },
        { $group: { _id: { $month: "$date" }, total: { $sum: "$amount" } } }
    ]);
    expenses.forEach(e => { if (e._id) financialMap[e._id - 1].expenses = e.total; });

    // Calculate Profit
    financialMap.forEach(item => {
        item.profit = item.revenue - item.expenses;
        // Pending is difficult to snapshot historically, leaving as 0 to avoid misleading data.
        // Or we could distribute current pending if we had due dates, but simplification is safer.
        item.pending = 0;
    });

    res.json({
        leadTypes,
        memberTrendData: memberTrendMap,
        financialData: financialMap
    });
});

module.exports = {
    getDashboardStats,
    getRecentFollowUps,
    getDashboardCharts
};
