const asyncHandler = require('express-async-handler');
const Member = require('../../models/Member');
const FollowUp = require('../../models/FollowUp');
const Sale = require('../../models/Sale');

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
        .limit(5);

    res.json(followUps);
});

// @desc    Get Financial/Chart Data
// @route   GET /api/admin/dashboard/charts
// @access  Private/Admin
const getDashboardCharts = asyncHandler(async (req, res) => {
    // Lead Type Distribution (Cold, Warm, Hot)
    const leadTypeStats = await require('../../models/Enquiry').aggregate([
        {
            $group: {
                _id: "$leadType",
                count: { $sum: 1 }
            }
        }
    ]);

    // Map colors to types
    const colors = {
        'Hot': '#ef4444',
        'Warm': '#f97316',
        'Cold': '#0ea5e9'
    };

    const leadTypes = leadTypeStats.map(stat => ({
        name: stat._id || 'Unknown',
        value: stat.count,
        color: colors[stat._id] || '#cbd5e1'
    }));

    res.json({
        leadTypes
    });
});

module.exports = {
    getDashboardStats,
    getRecentFollowUps,
    getDashboardCharts
};
