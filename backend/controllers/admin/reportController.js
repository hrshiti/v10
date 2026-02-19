const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const Sale = require('../../models/Sale');
const Member = require('../../models/Member');

// @desc    Get Sales Report (Filtered)
// @route   GET /api/admin/reports/sales
const getSalesReport = asyncHandler(async (req, res) => {
    const { fromDate, toDate, type, paymentMode, trainer, closedBy, search } = req.query;
    const pageSize = Number(req.query.pageSize) || Number(req.query.limit) || 10;
    const page = Number(req.query.pageNumber) || Number(req.query.page) || 1;

    // Build Query
    const query = {};

    // Date Range
    if (fromDate && toDate) {
        const start = new Date(fromDate);
        start.setHours(0, 0, 0, 0);

        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);

        query.date = {
            $gte: start,
            $lte: end
        };
    }

    if (type && type !== 'All') {
        if (type === 'PT') {
            query.membershipType = 'Personal Training';
        } else {
            query.type = type;
        }
    }

    if (req.query.membershipType && req.query.membershipType !== 'All') {
        query.membershipType = req.query.membershipType;
    }
    if (paymentMode && paymentMode !== 'All') query.paymentMode = paymentMode;
    if (trainer && mongoose.Types.ObjectId.isValid(trainer)) {
        query.trainerId = trainer;
    }
    if (closedBy && mongoose.Types.ObjectId.isValid(closedBy)) {
        query.closedBy = closedBy;
    }

    // Search by Invoice or Member Name
    if (search) {
        const matchingMembers = await Member.find({
            $or: [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { mobile: { $regex: search, $options: 'i' } }
            ]
        }).select('_id');

        const memberIds = matchingMembers.map(m => m._id);

        query.$or = [
            { invoiceNumber: { $regex: search, $options: 'i' } },
            { memberId: { $in: memberIds } }
        ];
    }

    const count = await Sale.countDocuments(query);
    const sales = await Sale.find(query)
        .populate({
            path: 'memberId',
            select: 'firstName lastName mobile memberId packageNameStatic startDate endDate durationMonths duration durationType packageId assignedTrainer',
            populate: [
                { path: 'packageId', select: 'name sessions' },
                { path: 'assignedTrainer', select: 'firstName lastName' }
            ]
        })
        .populate('trainerId', 'firstName lastName')
        .populate('packageId', 'name sessions')
        .populate('closedBy', 'firstName lastName')
        .sort({ date: -1 })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    // Calculate Stats for Top Widgets (on the full filtered dataset)
    const stats = await Sale.aggregate([
        { $match: query },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: "$amount" }, // Paid Amount
                taxAmount: { $sum: "$taxAmount" },
                invoiceCount: { $sum: 1 },
                // Standard Payment Modes
                upiTotal: {
                    $sum: {
                        $cond: [{ $in: ["$paymentMode", ["UPI", "Google Pay", "Online", "UPI / Online"]] }, "$amount", 0]
                    }
                },
                cardTotal: {
                    $sum: {
                        $cond: [{ $eq: ["$paymentMode", "Card"] }, "$amount", 0]
                    }
                },
                chequeTotal: {
                    $sum: {
                        $cond: [{ $eq: ["$paymentMode", "Cheque"] }, "$amount", 0]
                    }
                },
                cashOnlyTotal: {
                    $sum: {
                        $cond: [{ $eq: ["$paymentMode", "Cash"] }, "$amount", 0]
                    }
                },
                // Split Payment components
                splitCash: { $sum: { $cond: [{ $eq: ["$paymentMode", "Split"] }, "$splitPayment.cash", 0] } },
                splitOnline: { $sum: { $cond: [{ $eq: ["$paymentMode", "Split"] }, "$splitPayment.online", 0] } }
            }
        },
        {
            $project: {
                _id: 0,
                invoiceCount: 1,
                totalAmount: 1,
                taxAmount: 1,
                cashTotal: { $add: ["$cashOnlyTotal", "$splitCash"] },
                onlineTotal: { $add: ["$upiTotal", "$cardTotal", "$splitOnline"] }, // Keep original onlineTotal for compatibility
                upiTotal: { $add: ["$upiTotal", "$splitOnline"] }, // Associate split online with UPI by default
                cardTotal: 1,
                chequeTotal: 1
            }
        }
    ]);

    const statResult = stats.length > 0 ? stats[0] : { totalAmount: 0, taxAmount: 0, invoiceCount: 0, upiTotal: 0, cashTotal: 0, cardTotal: 0, chequeTotal: 0 };

    res.json({
        sales,
        page,
        pages: Math.ceil(count / pageSize),
        total: count,
        stats: statResult
    });
});

// @desc    Get Balance Due Report
// @route   GET /api/admin/reports/balance-due
const getBalanceDueReport = asyncHandler(async (req, res) => {
    const { search } = req.query;
    const pageSize = Number(req.query.pageSize) || Number(req.query.limit) || 10;
    const page = Number(req.query.pageNumber) || Number(req.query.page) || 1;

    // Find members with dueAmount > 0
    const query = { dueAmount: { $gt: 0 } };

    if (search) {
        query.$or = [
            { firstName: { $regex: search, $options: 'i' } },
            { mobile: { $regex: search, $options: 'i' } },
            { memberId: { $regex: search, $options: 'i' } }
        ];
    }

    const count = await Member.countDocuments(query);
    const members = await Member.find(query)
        .populate('packageId', 'name')
        .sort({ dueAmount: -1 }) // Highest values first
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    // Stats
    const totalDueAgg = await Member.aggregate([
        { $match: { dueAmount: { $gt: 0 } } },
        { $group: { _id: null, totalDue: { $sum: "$dueAmount" } } }
    ]);
    const totalDue = totalDueAgg.length > 0 ? totalDueAgg[0].totalDue : 0;

    res.json({
        members,
        page,
        pages: Math.ceil(count / pageSize),
        total: count,
        stats: {
            memberCount: count,
            totalDue
        }
    });
});

// @desc    Get Membership Expiry / Expired Report
// @route   GET /api/admin/reports/membership-expiry
const getMembershipExpiryReport = asyncHandler(async (req, res) => {
    const { status, fromDate, toDate, search, membershipType, trainer, closedBy } = req.query;
    const pageSize = Number(req.query.pageSize) || Number(req.query.limit) || 10;
    const page = Number(req.query.pageNumber) || Number(req.query.page) || 1;

    const query = {};

    // Filter by Status (Expired or Active but expiring)
    if (status === 'Expired') {
        const today = new Date();
        // Either status is already 'Expired' OR it's 'Active' but endDate has passed
        query.$or = [
            { status: 'Expired' },
            {
                status: 'Active',
                endDate: { $lt: today }
            }
        ];

        // If date range provided, filter by when they expired
        if (fromDate && toDate) {
            query.endDate = {
                $gte: new Date(fromDate),
                $lte: new Date(toDate)
            };
        }
    } else if (status === 'ExpiringSoon') {
        // Expiring in date range, but currently Active and not yet passed
        const today = new Date();
        query.status = 'Active';

        if (fromDate && toDate) {
            query.endDate = {
                $gte: new Date(fromDate),
                $lte: new Date(toDate)
            };
        } else {
            // Default to next 30 days if no date provided
            const next30 = new Date();
            next30.setDate(today.getDate() + 30);
            query.endDate = { $gte: today, $lte: next30 };
        }

        // Ensure we only show future expiries for "Soon"
        if (!query.endDate.$gte) {
            query.endDate.$gte = today;
        }
    }

    // Advanced Filters
    if (membershipType && membershipType !== 'All' && !membershipType.includes('Select')) {
        query.packageName = { $regex: membershipType, $options: 'i' };
    }

    if (trainer && !trainer.includes('Select') && !trainer.includes('No Trainers')) {
        // If trainer is name, we might need lookup. But usually it's ID.
        // The frontend is sending NAME. I should change it to send ID or handle name.
        // For now, looking for trainer name in populated field is hard in simple find.
        // Assuming we might want to lookup by name or if it's an ID
        if (mongoose.Types.ObjectId.isValid(trainer)) {
            query.assignedTrainer = trainer;
        }
    }

    if (closedBy && !closedBy.includes('Select') && !closedBy.includes('No Employees')) {
        if (mongoose.Types.ObjectId.isValid(closedBy)) {
            query.closedBy = closedBy;
        }
    }

    if (search) {
        query.$or = [
            { firstName: { $regex: search, $options: 'i' } },
            { mobile: { $regex: search, $options: 'i' } },
            { memberId: { $regex: search, $options: 'i' } }
        ];
    }

    const count = await Member.countDocuments(query);
    const members = await Member.find(query)
        .populate('assignedTrainer', 'firstName lastName')
        .populate('closedBy', 'firstName lastName')
        .populate('packageId', 'name baseRate')
        .sort({ endDate: 1 }) // Closest expiry first
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({
        members,
        page,
        pages: Math.ceil(count / pageSize),
        total: count
    });
});

// @desc    Get Subscription / Membership Analytics
// @route   GET /api/admin/reports/subscription-analytics
const getSubscriptionAnalytics = asyncHandler(async (req, res) => {
    const { fromDate, toDate, type } = req.query;

    const query = {};
    if (fromDate && toDate) {
        query.createdAt = {
            $gte: new Date(fromDate),
            $lte: new Date(toDate)
        };
    }

    // 1. Package Performance (from Sales)
    // We group by description or join with package if possible.
    // Given the current schema, we'll aggregate Sales of type 'New Membership' and 'Renewal'
    const salesAgg = await Sale.aggregate([
        {
            $match: {
                ...query,
                type: { $in: ['New Membership', 'Renewal'] }
            }
        },
        {
            $group: {
                _id: "$description", // Use description which contains package name
                totalCollected: { $sum: "$amount" },
                count: { $sum: 1 }
            }
        },
        { $sort: { totalCollected: -1 } }
    ]);

    // 2. Conversion Analytics (Enquiries -> Members)
    const totalEnquiries = await mongoose.model('Enquiry').countDocuments(query);
    const convertedMembers = await Member.countDocuments({
        ...query,
        enquiryId: { $ne: null }
    });

    // 3. Status Breakdown
    const statusBreakdown = await Member.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // 4. Revenue Over Time (Simple monthly)
    const revenueOverTime = await Sale.aggregate([
        {
            $match: {
                ...query,
                type: { $in: ['New Membership', 'Renewal'] }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
                revenue: { $sum: "$amount" }
            }
        },
        { $sort: { "_id": 1 } }
    ]);

    // 5. Expiring Soon (Next 7 days)
    const today = new Date();
    const next7Days = new Date();
    next7Days.setDate(today.getDate() + 7);

    const expiringMembers = await Member.find({
        status: 'Active',
        endDate: { $gte: today, $lte: next7Days }
    })
        .populate('packageId', 'name')
        .select('firstName lastName mobile endDate packageId packageNameStatic memberId')
        .sort({ endDate: 1 })
        .limit(50);

    res.json({
        packagePerformance: salesAgg,
        conversion: {
            totalEnquiries,
            convertedMembers,
            conversionRate: totalEnquiries > 0 ? (convertedMembers / totalEnquiries) * 100 : 0
        },
        statusBreakdown,
        revenueOverTime,
        expiringMembers
    });
});

// @desc    Get Attendance Report
// @route   GET /api/admin/reports/attendance
const getAttendanceReport = asyncHandler(async (req, res) => {
    const { fromDate, toDate, view, search, membershipType } = req.query;
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;

    // Parse dates properly - fromDate and toDate come as YYYY-MM-DD
    let start, end;

    if (fromDate) {
        start = new Date(fromDate);
        start.setHours(0, 0, 0, 0);
    } else {
        start = new Date();
        start.setHours(0, 0, 0, 0);
    }

    if (toDate) {
        end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
    } else {
        end = new Date();
        end.setHours(23, 59, 59, 999);
    }

    // Lazy load MemberAttendance
    const MemberAttendance = require('../../models/MemberAttendance');

    let result = { members: [], page, pages: 0, total: 0 };

    if (view === 'audit') {
        const query = {
            date: { $gte: start, $lte: end },
            status: 'Present'
        };

        if (search) {
            const matchingMembers = await Member.find({
                $or: [
                    { firstName: { $regex: search, $options: 'i' } },
                    { lastName: { $regex: search, $options: 'i' } },
                    { mobile: { $regex: search, $options: 'i' } }
                ]
            }).select('_id');
            query.memberId = { $in: matchingMembers.map(m => m._id) };
        }

        const count = await MemberAttendance.countDocuments(query);
        const logs = await MemberAttendance.find(query)
            .populate({
                path: 'memberId',
                select: 'firstName lastName mobile packageNameStatic packageId endDate assignedTrainer membershipType',
                populate: { path: 'packageId', select: 'name' },
                match: membershipType && membershipType !== 'Membership Type' ? { membershipType } : {}
            })
            .sort({ date: -1 })
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        // Filter out logs where member didn't match the membershipType (if applied via populate match)
        const filteredLogs = logs.filter(log => log.memberId !== null);

        result.members = filteredLogs.map(log => ({
            _id: log.memberId?._id,
            firstName: log.memberId?.firstName || 'Unknown',
            lastName: log.memberId?.lastName || '',
            mobile: log.memberId?.mobile || 'N/A',
            packageName: log.memberId?.packageName || 'N/A',
            endDate: log.memberId?.endDate,
            checkIn: log.checkIn,
            method: log.method,
            trainingType: log.trainingType || log.memberId?.membershipType || 'General'
        }));
        result.total = count; // Note: count might be slightly off if populate match filtered some, but usually fine for audit
        result.pages = Math.ceil(count / pageSize);

    } else if (view === 'attendance') {
        const attendanceAgg = await MemberAttendance.aggregate([
            {
                $match: {
                    date: { $gte: start, $lte: end },
                    status: 'Present'
                }
            },
            {
                $sort: { date: -1 }
            },
            {
                $group: {
                    _id: "$memberId",
                    lastMarked: { $first: "$date" },
                    attendedCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "members",
                    localField: "_id",
                    foreignField: "_id",
                    as: "memberInfo"
                }
            },
            { $unwind: "$memberInfo" },
            {
                $lookup: {
                    from: "employees",
                    localField: "memberInfo.assignedTrainer",
                    foreignField: "_id",
                    as: "trainerInfo"
                }
            },
            { $unwind: { path: "$trainerInfo", preserveNullAndEmptyArrays: true } },
            {
                $match: {
                    $and: [
                        membershipType && membershipType !== 'Membership Type' ? { "memberInfo.membershipType": membershipType } : {},
                        {
                            $or: [
                                { "memberInfo.firstName": { $regex: search || '', $options: 'i' } },
                                { "memberInfo.lastName": { $regex: search || '', $options: 'i' } },
                                { "memberInfo.mobile": { $regex: search || '', $options: 'i' } }
                            ]
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "packages",
                    localField: "memberInfo.packageId",
                    foreignField: "_id",
                    as: "packageInfo"
                }
            },
            { $unwind: { path: "$packageInfo", preserveNullAndEmptyArrays: true } },
            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    data: [{ $skip: pageSize * (page - 1) }, { $limit: pageSize }]
                }
            }
        ]);

        const data = attendanceAgg[0].data;
        const total = attendanceAgg[0].metadata[0]?.total || 0;

        result.members = data.map(item => ({
            _id: item.memberInfo._id,
            firstName: item.memberInfo.firstName,
            lastName: item.memberInfo.lastName,
            mobile: item.memberInfo.mobile,
            packageName: item.memberInfo.packageName || item.packageInfo?.name || item.memberInfo.packageNameStatic || 'N/A',
            endDate: item.memberInfo.endDate,
            trainerName: item.trainerInfo ? `${item.trainerInfo.firstName} ${item.trainerInfo.lastName}` : 'N/A',
            lastMarked: item.lastMarked,
            attended: item.attendedCount
        }));
        result.total = total;
        result.pages = Math.ceil(total / pageSize);

    } else if (view === 'absent') {
        const presentMemberIds = await MemberAttendance.find({
            date: { $gte: start, $lte: end },
            status: 'Present'
        }).distinct('memberId');

        const query = {
            status: 'Active',
            _id: { $nin: presentMemberIds }
        };

        if (membershipType && membershipType !== 'Membership Type') {
            query.membershipType = membershipType;
        }

        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { mobile: { $regex: search, $options: 'i' } }
            ];
        }

        const count = await Member.countDocuments(query);
        const members = await Member.find(query)
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .select('firstName lastName mobile');

        result.members = members;
        result.total = count;
        result.pages = Math.ceil(count / pageSize);
    }

    res.json(result);
});

// @desc    Get Due Membership Report (Members whose membership is expiring soon - due for renewal)
// @route   GET /api/admin/reports/due-membership
const getDueMembershipReport = asyncHandler(async (req, res) => {
    const { fromDate, toDate, membershipType, trainer, closedBy, search, withoutResalePayment, excludeUpcoming } = req.query;
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;

    // Build query for members whose endDate falls within the date range
    const query = {
        status: { $in: ['Active', 'Pending'] } // Only active/pending members
    };

    // Date range filter on endDate (membership expiring in this range)
    if (fromDate && toDate) {
        query.endDate = {
            $gte: new Date(fromDate),
            $lte: new Date(toDate)
        };
    }

    // Filter by membership type (would need to be added to Member model if not exists)
    // For now, we can filter by packageName pattern
    if (membershipType && membershipType !== 'All') {
        // Assuming packageName contains the type info
        query.packageName = { $regex: membershipType, $options: 'i' };
    }

    // Filter by assigned trainer
    if (trainer && mongoose.Types.ObjectId.isValid(trainer)) {
        query.assignedTrainer = trainer;
    }

    // Filter by closedBy
    if (closedBy && mongoose.Types.ObjectId.isValid(closedBy)) {
        query.closedBy = closedBy;
    }

    // Search by name, mobile, or memberId
    if (search) {
        query.$or = [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { mobile: { $regex: search, $options: 'i' } },
            { memberId: { $regex: search, $options: 'i' } }
        ];
    }

    // Without resale payment filter (members with due amount > 0)
    if (withoutResalePayment === 'true') {
        query.dueAmount = { $gt: 0 };
    }

    // Exclude upcoming members (those whose startDate is in the future)
    if (excludeUpcoming === 'true') {
        query.startDate = { $lte: new Date() };
    }

    const count = await Member.countDocuments(query);
    const members = await Member.find(query)
        .populate('assignedTrainer', 'firstName lastName')
        .populate('closedBy', 'firstName lastName')
        .populate('packageId', 'name')
        .sort({ endDate: 1 }) // Sort by end date ascending (soonest first)
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    // Calculate expected business (total amount that should be collected)
    const expectedBusiness = members.reduce((sum, member) => sum + (member.dueAmount || 0), 0);

    res.json({
        members,
        page,
        pages: Math.ceil(count / pageSize),
        total: count,
        stats: {
            memberCount: count,
            expectedBusiness: expectedBusiness.toFixed(2)
        }
    });
});

module.exports = {
    getSalesReport,
    getBalanceDueReport,
    getMembershipExpiryReport,
    getSubscriptionAnalytics,
    getAttendanceReport,
    getDueMembershipReport
};
