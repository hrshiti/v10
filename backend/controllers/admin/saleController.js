const asyncHandler = require('express-async-handler');
const Sale = require('../../models/Sale');

// @desc    Get All Sales with Pagination
// @route   GET /api/admin/sales
// @access  Private/Admin
const getSales = asyncHandler(async (req, res) => {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;
    const { keyword, fromDate, toDate } = req.query;

    const query = {};

    // Member search/Keyword search
    if (keyword) {
        const Member = require('../../models/Member');
        const matchingMembers = await Member.find({
            $or: [
                { firstName: { $regex: keyword, $options: 'i' } },
                { lastName: { $regex: keyword, $options: 'i' } },
                { mobile: { $regex: keyword, $options: 'i' } }
            ]
        }).select('_id');

        query.$or = [
            { invoiceNumber: { $regex: keyword, $options: 'i' } },
            { memberId: { $in: matchingMembers.map(m => m._id) } }
        ];
    }

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

    const count = await Sale.countDocuments(query);
    const sales = await Sale.find(query)
        .populate('memberId', 'firstName lastName mobile')
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort({ date: -1 });

    res.json({ sales, page, pages: Math.ceil(count / pageSize), total: count });
});

// @desc    Get Sales by Member ID (Invoice History)
// @route   GET /api/admin/sales/member/:memberId
// @access  Private/Admin
const getSalesByMember = asyncHandler(async (req, res) => {
    const sales = await Sale.find({ memberId: req.params.memberId })
        .populate('memberId', 'firstName lastName memberId')
        .sort({ date: -1 });
    res.json(sales);
});

// @desc    Get Sale by Invoice Number
// @route   GET /api/admin/sales/invoice/:invoiceNumber
// @access  Private/Admin
const getSaleByInvoiceNumber = asyncHandler(async (req, res) => {
    const sale = await Sale.findOne({ invoiceNumber: req.params.invoiceNumber })
        .populate('memberId')
        .populate('closedBy', 'firstName lastName');

    if (sale) {
        res.json(sale);
    } else {
        res.status(404);
        throw new Error('Invoice not found');
    }
});

module.exports = { getSales, getSalesByMember, getSaleByInvoiceNumber };
