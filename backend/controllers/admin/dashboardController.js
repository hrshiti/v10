const asyncHandler = require('express-async-handler');
const Member = require('../../models/Member');
const FollowUp = require('../../models/FollowUp');
const Sale = require('../../models/Sale');

// @desc    Get Dashboard Statistics (Cards)
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
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

    // 4. Financials (Total Revenue via Aggregation)
    const revenueAgg = await Sale.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: "$amount" }
            }
        }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    // Calculate Pending Payments (from Member.dueAmount)
    const dueAgg = await Member.aggregate([
        {
            $group: {
                _id: null,
                totalDue: { $sum: "$dueAmount" }
            }
        }
    ]);
    const pendingPayment = dueAgg.length > 0 ? dueAgg[0].totalDue : 0;

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
        },
        financial: {
            totalRevenue,
            pendingPayment,
            totalExpenses: 0 // TODO: Add Expense Model later
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
