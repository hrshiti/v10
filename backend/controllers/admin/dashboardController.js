const asyncHandler = require('express-async-handler');
const Member = require('../../models/Member');
const FollowUp = require('../../models/FollowUp');
const Sale = require('../../models/Sale');
const Expense = require('../../models/Expense');
const Enquiry = require('../../models/Enquiry');

// @desc    Get Dashboard Statistics (Cards)
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
const MemberAttendance = require('../../models/MemberAttendance');

const EmployeeAttendance = require('../../models/EmployeeAttendance');

// @desc    Get Dashboard Statistics (Cards)
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
    // Helper for Start/End of Day
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Support Date Filtering
    let rangeStart = startOfDay;
    let rangeEnd = endOfDay;

    if (req.query.startDate && req.query.endDate) {
        rangeStart = new Date(req.query.startDate);
        rangeEnd = new Date(req.query.endDate);
        rangeEnd.setHours(23, 59, 59, 999);
    }

    // 1. Members
    const activeMembersCount = await Member.countDocuments({ status: 'Active' });
    const upcomingMembers = await Enquiry.countDocuments({
        commitmentDate: { $gte: startOfDay },
        status: { $ne: 'Closed' } // Only count open enquiries
    });
    const expiredMembersCount = await Member.countDocuments({
        $or: [
            { status: 'Expired' },
            { endDate: { $lt: startOfDay } }
        ]
    });

    // 2. Commitment Dues Stats
    const next30Days = new Date(today);
    next30Days.setDate(today.getDate() + 30);
    next30Days.setHours(23, 59, 59, 999);

    const commitmentDuesToday = await Member.countDocuments({
        dueAmount: { $gt: 0 },
        $or: [
            { commitmentDate: { $lte: endOfDay } },
            { commitmentDate: { $exists: false } },
            { commitmentDate: null }
        ]
    });

    const commitmentDuesUpcoming = await Member.countDocuments({
        dueAmount: { $gt: 0 },
        $or: [
            { commitmentDate: { $lte: next30Days } },
            { commitmentDate: { $exists: false } },
            { commitmentDate: null }
        ]
    });

    // 3. Enquiries (Filtered by range)
    const newEnquiries = await Enquiry.countDocuments({
        createdAt: { $gte: rangeStart, $lte: rangeEnd }
    });

    // 4. Financials (Total Revenue via Aggregation) & Sales Breakdown
    const salesStats = await Sale.aggregate([
        { $match: { date: { $gte: rangeStart, $lte: rangeEnd } } },
        {
            $project: {
                type: 1,
                membershipType: 1,
                amount: 1,
                // Calculate effective booking value for THIS document
                bookingValue: {
                    $cond: {
                        if: { $gt: [{ $ifNull: ["$subTotal", 0] }, 0] }, // If subTotal exists and > 0
                        then: {
                            $subtract: [
                                { $add: ["$subTotal", { $ifNull: ["$taxAmount", 0] }] },
                                { $ifNull: ["$discountAmount", 0] }
                            ]
                        },
                        // Fallback to paid amount for legacy records or simple payments
                        else: "$amount"
                    }
                }
            }
        },
        {
            $group: {
                _id: {
                    type: "$type",
                    membershipType: "$membershipType"
                },
                count: { $sum: 1 },
                amount: { $sum: "$amount" }, // Cash collected
                totalValue: { $sum: "$bookingValue" } // Booking/Invoice Value
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
        const type = stat._id.type;
        const membershipType = stat._id.membershipType;
        const isPT = membershipType === 'Personal Training';

        // Use the aggregated Booking Value
        const totalValue = stat.totalValue || 0;

        totalRevenue += stat.amount; // Revenue is strictly cash collected
        totalSalesCount += stat.count;

        if (isPT) {
            if (type === 'New Membership' || type === 'PT') {
                ptSales.number += stat.count;
                ptSales.amount += totalValue;
            } else if (type === 'Renewal' || type === 'PT Renewal') {
                ptRenewalSales.number += stat.count;
                ptRenewalSales.amount += totalValue;
            }
        } else {
            // General Training or others
            if (type === 'New Membership') {
                freshSales.number += stat.count;
                freshSales.amount += totalValue;
            } else if (type === 'Renewal') {
                renewalSales.number += stat.count;
                renewalSales.amount += totalValue;
            }
        }

        // Always categorize these if present
        if (type === 'Upgrade') {
            upgradeSales.number += stat.count;
            upgradeSales.amount += totalValue;
        } else if (type === 'Transfer') {
            transferSales.number += stat.count;
            transferSales.amount += totalValue;
        }
    });

    // 5. Payment Stats (Paid vs Due)
    const paidAgg = await Member.aggregate([
        { $group: { _id: null, totalPaid: { $sum: "$paidAmount" } } }
    ]);
    const paidAmount = paidAgg.length > 0 ? paidAgg[0].totalPaid : 0;

    const dueAgg = await Member.aggregate([
        { $group: { _id: null, totalDue: { $sum: "$dueAmount" } } }
    ]);
    const pendingPayment = dueAgg.length > 0 ? dueAgg[0].totalDue : 0;


    // 6. Attendance Stats
    const presentCount = await MemberAttendance.countDocuments({
        date: { $gte: startOfDay, $lte: endOfDay },
        status: 'Present'
    });
    const absentCount = Math.max(0, activeMembersCount - presentCount);

    // Active Trainers Count (Currently on duty)
    const activeAttendanceSummary = await EmployeeAttendance.find({
        date: { $gte: startOfDay, $lte: endOfDay },
        outTime: { $exists: false }
    }).populate({
        path: 'employeeId',
        select: 'gymRole active'
    });

    const activeTrainersCount = activeAttendanceSummary.filter(record => {
        const emp = record.employeeId;
        if (!emp || !emp.active) return false;

        const roles = emp.gymRole || [];
        return roles.some(role => typeof role === 'string' && role.toLowerCase().includes('trainer'));
    }).length;

    // Birthdays & Anniversaries (Today)
    const todayDay = new Date().getDate();
    const todayMonth = new Date().getMonth() + 1;

    const birthdayCountArr = await Member.aggregate([
        { $match: { dob: { $ne: null } } },
        { $project: { month: { $month: "$dob" }, day: { $dayOfMonth: "$dob" } } },
        { $match: { month: todayMonth, day: todayDay } }
    ]);

    const anniversaryCountArr = await Member.aggregate([
        { $match: { admissionDate: { $ne: null } } },
        { $project: { month: { $month: "$admissionDate" }, day: { $dayOfMonth: "$admissionDate" } } },
        { $match: { month: todayMonth, day: todayDay } }
    ]);


    const stats = {
        members: {
            active: activeMembersCount,
            upcoming: upcomingMembers,
            expired: expiredMembersCount
        },
        commitmentDues: {
            today: commitmentDuesToday,
            upcoming: commitmentDuesUpcoming
        },
        enquiries: {
            new: newEnquiries,
            sales: freshSales.number
        },
        attendance: {
            present: presentCount,
            absent: absentCount,
            activeTrainers: activeTrainersCount,
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

// @desc    Get Expiring Members
// @route   GET /api/admin/dashboard/expiring-members
// @access  Private/Admin
// @desc    Get Members with Commitment Dues (Payments Today/Upcoming)
// @route   GET /api/admin/dashboard/commitment-dues
// @access  Private/Admin
const getCommitmentDues = asyncHandler(async (req, res) => {
    const days = parseInt(req.query.days) || 30;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + days);
    futureDate.setHours(23, 59, 59, 999);

    const commitmentDues = await Member.find({
        dueAmount: { $gt: 0 },
        $or: [
            { commitmentDate: { $lte: futureDate } },
            { commitmentDate: { $exists: false } },
            { commitmentDate: null }
        ]
    })
        .select('firstName lastName memberId photo mobile packageName commitmentDate dueAmount')
        .sort({ commitmentDate: 1 })
        .limit(50);

    const membersWithDaysLeft = commitmentDues.map(member => {
        let diffDays = 0;
        if (member.commitmentDate) {
            const commitment = new Date(member.commitmentDate);
            commitment.setHours(0, 0, 0, 0);
            const diffTime = commitment - today;
            diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        } else {
            // No date set - treat as due today/pending
            diffDays = 0;
        }

        return {
            ...member._doc,
            daysLeft: diffDays
        };
    });

    res.json(membersWithDaysLeft);
});

// @desc    Get Financial/Chart Data
// @route   GET /api/admin/dashboard/charts
// @access  Private/Admin
const getDashboardCharts = asyncHandler(async (req, res) => {
    // 1. Membership Distribution (By Package Name)
    const membershipStats = await Member.aggregate([
        { $match: { status: 'Active' } },
        { $group: { _id: "$packageName", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);

    // Dynamic Colors for packages
    const packageColors = ['#10b981', '#f97316', '#3b82f6', '#8b5cf6', '#ec4899', '#6366f1'];
    const membershipDistribution = membershipStats.map((stat, index) => ({
        name: stat._id || 'Unknown',
        value: stat.count,
        color: packageColors[index % packageColors.length]
    }));

    // 2. Prepare Ranges
    let startOfTrend = new Date(new Date().getFullYear(), 0, 1);
    let endOfTrend = new Date(); // Default to today/now

    if (req.query.startDate && req.query.endDate) {
        startOfTrend = new Date(req.query.startDate);
        endOfTrend = new Date(req.query.endDate);
        endOfTrend.setHours(23, 59, 59, 999);
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Initialize Maps
    const memberTrendMap = months.map(m => ({ name: m, active: 0, inactive: 0, upcoming: 0 }));
    const financialMap = months.map(m => ({ name: m, revenue: 0, pending: 0, expenses: 0, profit: 0 }));

    // 3. Member Trend Data
    // Active -> New Sales
    const newSales = await Sale.aggregate([
        { $match: { date: { $gte: startOfTrend, $lte: endOfTrend }, type: 'New Membership' } },
        { $group: { _id: { $month: "$date" }, count: { $sum: 1 } } }
    ]);
    newSales.forEach(s => { if (s._id) memberTrendMap[s._id - 1].active = s.count; });

    // Upcoming -> Renewals (Legend says Renewal)
    const renewals = await Sale.aggregate([
        { $match: { date: { $gte: startOfTrend, $lte: endOfTrend }, type: 'Renewal' } },
        { $group: { _id: { $month: "$date" }, count: { $sum: 1 } } }
    ]);
    renewals.forEach(s => { if (s._id) memberTrendMap[s._id - 1].upcoming = s.count; });

    // Inactive -> Expiries (Past/Present only)
    const expiries = await Member.aggregate([
        { $match: { endDate: { $gte: startOfTrend, $lte: endOfTrend } } },
        { $group: { _id: { $month: "$endDate" }, count: { $sum: 1 } } }
    ]);
    expiries.forEach(s => { if (s._id) memberTrendMap[s._id - 1].inactive = s.count; });

    // 4. Financial Data
    // Revenue -> All Sales sums
    const revenue = await Sale.aggregate([
        { $match: { date: { $gte: startOfTrend, $lte: endOfTrend } } },
        { $group: { _id: { $month: "$date" }, total: { $sum: "$amount" } } }
    ]);
    revenue.forEach(r => { if (r._id) financialMap[r._id - 1].revenue = r.total; });

    // Expenses -> All Expenses sums
    const expenses = await Expense.aggregate([
        { $match: { date: { $gte: startOfTrend, $lte: endOfTrend }, isDeleted: false } },
        { $group: { _id: { $month: "$date" }, total: { $sum: "$amount" } } }
    ]);
    expenses.forEach(e => { if (e._id) financialMap[e._id - 1].expenses = e.total; });

    // Pending -> Due Amount from Members based on their admission date (Current Year)
    const pendingDues = await Member.aggregate([
        { $match: { admissionDate: { $gte: startOfTrend, $lte: endOfTrend }, dueAmount: { $gt: 0 } } },
        { $group: { _id: { $month: "$admissionDate" }, total: { $sum: "$dueAmount" } } }
    ]);
    pendingDues.forEach(p => { if (p._id && financialMap[p._id - 1]) financialMap[p._id - 1].pending = p.total; });

    // Calculate Profit
    financialMap.forEach(item => {
        item.profit = item.revenue - item.expenses;
    });

    res.json({
        membershipDistribution,
        memberTrendData: memberTrendMap,
        financialData: financialMap
    });
});

// @desc    Get Live Gym Status (Active Members & Trainers)
// @route   GET /api/admin/dashboard/live-gym
// @access  Private/Admin
const getLiveGymStatus = asyncHandler(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Members in Gym
    const activeMembers = await MemberAttendance.find({
        date: { $gte: today },
        checkOut: { $exists: false }
    }).populate('memberId', 'firstName lastName memberId photo mobile');

    // 2. Trainers in Gym
    const activeAttendance = await EmployeeAttendance.find({
        date: { $gte: today },
        outTime: { $exists: false }
    }).populate('employeeId', 'firstName lastName photo gymRole active');

    const activeTrainers = activeAttendance.filter(record => {
        const emp = record.employeeId;
        if (!emp || !emp.active) return false;
        const roles = emp.gymRole || [];
        return roles.some(role => typeof role === 'string' && role.toLowerCase().includes('trainer'));
    });

    res.json({
        members: activeMembers,
        trainers: activeTrainers
    });
});

module.exports = {
    getDashboardStats,
    getCommitmentDues,
    getDashboardCharts,
    getLiveGymStatus
};
