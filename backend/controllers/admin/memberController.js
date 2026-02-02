const asyncHandler = require('express-async-handler');
const Member = require('../../models/Member');
const Sale = require('../../models/Sale');

// @desc    Get all members with pagination and search
// @route   GET /api/admin/members
// @access  Private/Admin
const getMembers = asyncHandler(async (req, res) => {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
        ? {
            $or: [
                { firstName: { $regex: req.query.keyword, $options: 'i' } },
                { lastName: { $regex: req.query.keyword, $options: 'i' } },
                { mobile: { $regex: req.query.keyword, $options: 'i' } },
                { memberId: { $regex: req.query.keyword, $options: 'i' } }
            ]
        }
        : {};

    // Filter by status if provided (e.g. ?status=Active)
    if (req.query.status) {
        keyword.status = req.query.status;
    }

    const count = await Member.countDocuments({ ...keyword });
    const members = await Member.find({ ...keyword })
        .populate('assignedTrainer', 'firstName lastName employeeId')
        .populate('closedBy', 'firstName lastName employeeId')
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort({ createdAt: -1 });

    res.json({ members, page, pages: Math.ceil(count / pageSize), total: count });
});

// @desc    Get member by ID
// @route   GET /api/admin/members/:id
// @access  Private/Admin
const getMemberById = asyncHandler(async (req, res) => {
    const member = await Member.findById(req.params.id)
        .populate('assignedTrainer', 'firstName lastName mobile')
        .populate('closedBy', 'firstName lastName mobile');
    if (member) {
        res.json(member);
    } else {
        res.status(404);
        throw new Error('Member not found');
    }
});

// @desc    Create a new member
// @route   POST /api/admin/members
// @access  Private/Admin
const createMember = asyncHandler(async (req, res) => {
    const {
        firstName, lastName, mobile, email, gender, dob, address,
        packageName, durationMonths, startDate, endDate,
        totalAmount, paidAmount, discount, assignedTrainer, closedBy,
        emergencyContactName, emergencyContactNumber,
        enquiryId
    } = req.body;

    const memberExists = await Member.findOne({ mobile });
    if (memberExists) {
        res.status(400);
        throw new Error('Member already exists with this mobile number');
    }

    const member = await Member.create({
        firstName, lastName, mobile, email, gender, dob, address,
        packageName, durationMonths, startDate, endDate,
        totalAmount, paidAmount, discount, assignedTrainer, closedBy,
        emergencyContact: {
            name: emergencyContactName,
            number: emergencyContactNumber
        },
        enquiryId
    });

    if (member) {
        // Automatically create a Sale record for this new membership
        await Sale.create({
            amount: paidAmount,
            discountAmount: discount || 0,
            trainerId: assignedTrainer,
            closedBy: closedBy,
            type: 'New Membership',
            memberId: member._id,
            description: `New Membership: ${packageName}`
        });

        res.status(201).json(member);
    } else {
        res.status(400);
        throw new Error('Invalid member data');
    }
});

// @desc    Update member
// @route   PUT /api/admin/members/:id
// @access  Private/Admin
const updateMember = asyncHandler(async (req, res) => {
    const member = await Member.findById(req.params.id);

    if (member) {
        member.firstName = req.body.firstName || member.firstName;
        member.lastName = req.body.lastName || member.lastName;
        member.email = req.body.email || member.email;
        member.mobile = req.body.mobile || member.mobile;

        // Update financial/plan details if provided (Note: complex logic might be needed for renewals)
        if (req.body.status) member.status = req.body.status;
        if (req.body.endDate) member.endDate = req.body.endDate;

        const updatedMember = await member.save();
        res.json(updatedMember);
    } else {
        res.status(404);
        throw new Error('Member not found');
    }
});

// @desc    Delete member
// @route   DELETE /api/admin/members/:id
// @access  Private/Admin
const deleteMember = asyncHandler(async (req, res) => {
    const member = await Member.findById(req.params.id);
    if (member) {
        await member.deleteOne();
        res.json({ message: 'Member removed' });
    } else {
        res.status(404);
        throw new Error('Member not found');
    }
});

// @desc    Get Member Stats
// @route   GET /api/admin/members/stats
// @access  Private/Admin
const getMemberStats = asyncHandler(async (req, res) => {
    const active = await Member.countDocuments({ status: 'Active' });
    const expired = await Member.countDocuments({ status: 'Expired' });
    const total = await Member.countDocuments({});

    // Upcoming expiries in next 7 days
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const expiringSoon = await Member.countDocuments({
        status: 'Active',
        endDate: { $lte: nextWeek } // Less than or equal to next week
    });

    res.json({
        active,
        expired,
        total,
        expiringSoon
    });
});

// @desc    Renew Membership
// @route   POST /api/admin/members/renew
// @access  Private/Admin
const renewMembership = asyncHandler(async (req, res) => {
    const { memberId, packageName, durationMonths, startDate, endDate, amount, paidAmount, discount, assignedTrainer, closedBy } = req.body;

    const member = await Member.findById(memberId);
    if (!member) {
        res.status(404);
        throw new Error('Member not found');
    }

    // Update Member details with new subscription
    member.packageName = packageName;
    member.durationMonths = durationMonths;
    member.startDate = startDate;
    member.endDate = endDate;
    member.status = 'Active';

    // Update reporting fields relative to CURRENT plan
    member.discount = discount || 0;
    if (assignedTrainer) member.assignedTrainer = assignedTrainer;
    if (closedBy) member.closedBy = closedBy;

    // Update financials (cumulative)
    member.totalAmount += Number(amount);
    member.paidAmount += Number(paidAmount);
    member.dueAmount = member.totalAmount - member.paidAmount;

    await member.save();

    // Create a new Sale Record for this renewal
    await Sale.create({
        memberId: member._id,
        amount: paidAmount,
        discountAmount: discount || 0,
        trainerId: assignedTrainer,
        closedBy: closedBy,
        type: 'Renewal',
        description: `Renewed: ${packageName} (${durationMonths} Months)`
    });

    res.json(member);
});

// @desc    Extend Membership (Add-On Days)
// @route   PUT /api/admin/members/:id/extend
// @access  Private/Admin
const extendMembership = asyncHandler(async (req, res) => {
    const { days } = req.body;
    const member = await Member.findById(req.params.id);

    if (member) {
        // Add days to endDate
        const currentEndDate = new Date(member.endDate);
        currentEndDate.setDate(currentEndDate.getDate() + Number(days));
        member.endDate = currentEndDate;

        // Ensure status is valid
        if (member.endDate > new Date()) {
            member.status = 'Active';
        }

        await member.save();
        res.json(member);
    } else {
        res.status(404);
        throw new Error('Member not found');
    }
});

// @desc    Change Start Date (and shift End Date)
// @route   PUT /api/admin/members/:id/change-start-date
// @access  Private/Admin
const changeStartDate = asyncHandler(async (req, res) => {
    const { newStartDate } = req.body;
    const member = await Member.findById(req.params.id);

    if (member) {
        // Calculate difference between old and new start date
        const oldStart = new Date(member.startDate);
        const newStart = new Date(newStartDate);
        const diffTime = newStart - oldStart;

        // Shift End Date by same difference to preserve duration
        const oldEnd = new Date(member.endDate);
        const newEnd = new Date(oldEnd.getTime() + diffTime);

        member.startDate = newStart;
        member.endDate = newEnd;

        await member.save();
        res.json(member);
    } else {
        res.status(404);
        throw new Error('Member not found');
    }
});

module.exports = {
    getMembers,
    getMemberById,
    createMember,
    updateMember,
    deleteMember,
    getMemberStats,
    renewMembership,
    extendMembership,
    changeStartDate
};
