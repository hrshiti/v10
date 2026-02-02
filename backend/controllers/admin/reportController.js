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

    // Date Range (Parse DD-MM-YYYY if coming from frontend, or standard YYYY-MM-DD)
    // Assuming ISO/Standard for API simplicity, frontend should convert.
    if (fromDate && toDate) {
        query.date = {
            $gte: new Date(fromDate),
            $lte: new Date(toDate)
        };
    }

    if (type && type !== 'All') query.type = type; // Type: Membership, PT
    if (paymentMode && paymentMode !== 'All') query.paymentMode = paymentMode;
    if (trainer && mongoose.Types.ObjectId.isValid(trainer)) {
        query.trainerId = trainer;
    }
    if (closedBy && mongoose.Types.ObjectId.isValid(closedBy)) {
        query.closedBy = closedBy;
    }

    // Search by Invoice or Member Name (requires lookup if advanced)
    if (search) {
        query.$or = [
            { invoiceNumber: { $regex: search, $options: 'i' } },
            // Note: Searching by Member Name in Sales requires aggregate/lookup, keeping simple for now
        ];
    }

    const count = await Sale.countDocuments(query);
    const sales = await Sale.find(query)
        .populate('memberId', 'firstName lastName mobile memberId packageName startDate durationMonths')
        .populate('trainerId', 'firstName lastName')
        .populate('closedBy', 'firstName lastName')
        .sort({ date: -1 })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    // Calculate Stats for Top Widgets (on the full filtered dataset)
    // We use aggregation for performance
    const stats = await Sale.aggregate([
        { $match: query },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: "$amount" }, // Paid Amount
                taxAmount: { $sum: "$taxAmount" },
                invoiceCount: { $sum: 1 },
                // Payment Modes
                onlineTotal: {
                    $sum: {
                        $cond: [{ $in: ["$paymentMode", ["UPI", "Google Pay", "Card"]] }, "$amount", 0]
                    }
                },
                cashTotal: {
                    $sum: {
                        $cond: [{ $eq: ["$paymentMode", "Cash"] }, "$amount", 0]
                    }
                }
            }
        }
    ]);

    const statResult = stats.length > 0 ? stats[0] : { totalAmount: 0, taxAmount: 0, invoiceCount: 0, onlineTotal: 0, cashTotal: 0 };

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
    const { status, fromDate, toDate, search } = req.query;
    const pageSize = Number(req.query.pageSize) || Number(req.query.limit) || 10;
    const page = Number(req.query.pageNumber) || Number(req.query.page) || 1;

    const query = {};

    // Filter by Status (Expired or Active but expiring)
    if (status === 'Expired') {
        query.status = 'Expired';
    } else if (status === 'ExpiringSoon') {
        // Expiring in date range, but currently Active
        query.status = 'Active';
        if (fromDate && toDate) {
            query.endDate = {
                $gte: new Date(fromDate),
                $lte: new Date(toDate)
            };
        } else {
            // Default to next 30 days if no date provided
            const today = new Date();
            const next30 = new Date();
            next30.setDate(today.getDate() + 30);
            query.endDate = { $gte: today, $lte: next30 };
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

module.exports = {
    getSalesReport,
    getBalanceDueReport,
    getMembershipExpiryReport
};
