const asyncHandler = require('express-async-handler');
const Member = require('../../models/Member');
const Sale = require('../../models/Sale');
const Subscription = require('../../models/Subscription');


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
        // Create Subscription record
        await Subscription.create({
            memberId: member._id,
            packageName,
            duration: durationMonths,
            startDate,
            endDate,
            totalAmount,
            paidAmount,
            discount: discount || 0,
            status: 'Active',
            isCurrent: true,
            assignedTrainer: assignedTrainer || null,
            createdBy: closedBy || null
        });

        // Automatically create a Sale record for this new membership
        await Sale.create({
            amount: paidAmount,
            discountAmount: discount || 0,
            trainerId: assignedTrainer || null,
            closedBy: closedBy || null,
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
        member.email = req.body.email === "" ? "" : (req.body.email || member.email);
        member.mobile = req.body.mobile || member.mobile;
        member.gender = req.body.gender || member.gender;
        member.dob = req.body.dob || member.dob;
        member.address = req.body.address || member.address;

        if (req.body.emergencyContact) {
            member.emergencyContact = {
                name: req.body.emergencyContact.name || member.emergencyContact?.name,
                number: req.body.emergencyContact.number || member.emergencyContact?.number
            };
        }

        // Update financial/plan details if provided
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
        endDate: { $lte: nextWeek }
    });

    // Today's Attendance
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Lazy load or require at top - good practice to check if already required, but here just inline require for safety or rely on top level
    const MemberAttendance = require('../../models/MemberAttendance');

    const todayAttendance = await MemberAttendance.countDocuments({
        date: { $gte: startOfDay, $lte: endOfDay },
        status: 'Present'
    });

    // Group by packageName and count
    const packageStats = await Member.aggregate([
        { $match: { status: 'Active' } },
        { $group: { _id: "$packageName", count: { $sum: 1 } } }
    ]);

    res.json({
        active,
        expired,
        total,
        expiringSoon,
        todayAttendance,
        packageStats
    });
});



// @desc    Renew Membership
// @route   POST /api/admin/members/renew
// @access  Private/Admin
const renewMembership = asyncHandler(async (req, res) => {
    const {
        memberId,
        packageName,
        durationMonths,
        startDate,
        endDate,
        amount,
        paidAmount,
        discount,
        subTotal,
        taxAmount,
        paymentMode,
        assignedTrainer,
        closedBy
    } = req.body;

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

    // Mark previous subscriptions as not current
    await Subscription.updateMany({ memberId: member._id }, { isCurrent: false });

    // Create a new Subscription record
    await Subscription.create({
        memberId: member._id,
        packageName,
        duration: durationMonths,
        startDate,
        endDate,
        totalAmount: amount,
        paidAmount,
        discount: discount || 0,
        status: 'Active',
        isCurrent: true,
        assignedTrainer: assignedTrainer || null,
        createdBy: closedBy || null
    });

    // Create a new Sale Record for this renewal
    await Sale.create({
        memberId: member._id,
        amount: paidAmount,
        subTotal: subTotal || amount,
        taxAmount: taxAmount || 0,
        discountAmount: discount || 0,
        paymentMode: paymentMode || 'Cash',
        trainerId: assignedTrainer || null,
        closedBy: closedBy || null,
        type: 'Renewal',
        description: `Renewed: ${packageName} (${durationMonths} Months)`
    });

    res.json(member);
});

// @desc    Create Fresh Sale (Multiple Subscriptions)
// @route   POST /api/admin/members/sale
// @access  Private/Admin
const createFreshSale = asyncHandler(async (req, res) => {
    const {
        memberId,
        selectedPlans,
        totalAmount,
        subTotal,
        taxAmount,
        paidAmount,
        discount,
        paymentMethod,
        comment,
        closedBy
    } = req.body;

    const member = await Member.findById(memberId);
    if (!member) {
        res.status(404);
        throw new Error('Member not found');
    }

    // Mark previous subscriptions as not current
    await Subscription.updateMany({ memberId: member._id }, { isCurrent: false });

    // Create subscriptions for each selected plan
    for (const plan of selectedPlans) {
        const start = new Date(plan.startDate);
        const end = new Date(start);
        if (plan.durationType === 'Months') {
            end.setMonth(end.getMonth() + plan.durationValue);
        } else {
            end.setDate(end.getDate() + plan.durationValue);
        }

        await Subscription.create({
            memberId: member._id,
            packageName: plan.name,
            duration: plan.durationValue,
            durationType: plan.durationType,
            startDate: start,
            endDate: end,
            totalAmount: plan.cost,
            paidAmount: plan.cost,
            status: 'Active',
            isCurrent: true,
            assignedTrainer: plan.trainerId || null,
            createdBy: closedBy || null
        });
    }

    // Update member profile with the LAST selected plan info
    const lastPlan = selectedPlans[selectedPlans.length - 1];
    if (lastPlan) {
        member.packageName = lastPlan.name;
        member.durationMonths = lastPlan.durationType === 'Months' ? lastPlan.durationValue : 0;
        member.startDate = lastPlan.startDate;
        const start = new Date(lastPlan.startDate);
        const end = new Date(start);
        if (lastPlan.durationType === 'Months') {
            end.setMonth(end.getMonth() + lastPlan.durationValue);
        } else {
            end.setDate(end.getDate() + lastPlan.durationValue);
        }
        member.endDate = end;
        if (lastPlan.trainerId) member.assignedTrainer = lastPlan.trainerId;
    }

    member.totalAmount += Number(totalAmount);
    member.paidAmount += Number(paidAmount);
    member.dueAmount = member.totalAmount - member.paidAmount;
    member.discount += Number(discount || 0);
    if (closedBy) member.closedBy = closedBy;
    member.status = 'Active';

    await member.save();

    // Create a new Sale record
    await Sale.create({
        memberId: member._id,
        amount: paidAmount,
        subTotal: subTotal || totalAmount,
        taxAmount: taxAmount || 0,
        discountAmount: discount || 0,
        date: new Date(),
        paymentMode: paymentMethod || 'Online',
        type: 'New Membership',
        description: `Fresh Sale: ${selectedPlans.map(p => p.name).join(', ')}. ${comment || ''}`,
        closedBy: closedBy || null
    });

    res.json({ message: 'Sale processed successfully', member });
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

        // Also update current subscription
        await Subscription.findOneAndUpdate(
            { memberId: member._id, isCurrent: true },
            { endDate: member.endDate, status: member.status }
        );

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

        // Also update current subscription
        await Subscription.findOneAndUpdate(
            { memberId: member._id, isCurrent: true },
            { startDate: member.startDate, endDate: member.endDate }
        );

        res.json(member);
    } else {
        res.status(404);
        throw new Error('Member not found');
    }
});

// @desc    Get all subscriptions for a member
// @route   GET /api/admin/members/:id/subscriptions
// @access  Private/Admin
const getMemberSubscriptions = asyncHandler(async (req, res) => {
    const subscriptions = await Subscription.find({ memberId: req.params.id })
        .populate('assignedTrainer', 'firstName lastName')
        .sort({ startDate: -1 });
    res.json(subscriptions);
});

// @desc    Freeze Membership
// @route   POST /api/admin/members/:id/freeze
// @access  Private/Admin
const freezeMembership = asyncHandler(async (req, res) => {
    const {
        startDate,
        endDate,
        freezeCharge,
        subTotal,
        taxAmount,
        paymentMethod,
        comment,
        closedBy
    } = req.body;
    const member = await Member.findById(req.params.id);

    if (!member) {
        res.status(404);
        throw new Error('Member not found');
    }

    const subscription = await Subscription.findOne({ memberId: member._id, isCurrent: true });
    if (!subscription) {
        res.status(400);
        throw new Error('No active subscription found to freeze');
    }

    // Update Subscription
    subscription.status = 'Frozen';
    subscription.freezeHistory.push({
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason: comment,
        durationDays: Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
    });
    await subscription.save();

    // Update Member
    member.status = 'Frozen';
    await member.save();

    // Create Sale record if there's a charge
    if (Number(freezeCharge) > 0) {
        await Sale.create({
            memberId: member._id,
            amount: freezeCharge,
            subTotal: subTotal || freezeCharge,
            taxAmount: taxAmount || 0,
            paymentMode: paymentMethod || 'Cash',
            type: 'Freeze Charge',
            description: `Membership frozen from ${startDate} to ${endDate}. ${comment || ''}`,
            closedBy: closedBy || null
        });
    }

    res.json({ message: 'Membership frozen successfully', subscription });
});

// @desc    Upgrade Membership
// @route   POST /api/admin/members/:id/upgrade
// @access  Private/Admin
const upgradeMembership = asyncHandler(async (req, res) => {
    const {
        packageName,
        durationMonths,
        startDate,
        endDate,
        amount,
        paidAmount,
        discount,
        subTotal,
        taxAmount,
        paymentMode,
        assignedTrainer,
        closedBy
    } = req.body;

    const member = await Member.findById(req.params.id);
    if (!member) {
        res.status(404);
        throw new Error('Member not found');
    }

    // Mark previous subscriptions as not current
    await Subscription.updateMany({ memberId: member._id }, { isCurrent: false });

    // Create new subscription
    const subscription = await Subscription.create({
        memberId: member._id,
        packageName,
        duration: durationMonths,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalAmount: amount,
        paidAmount: paidAmount,
        discount: discount || 0,
        status: 'Active',
        isCurrent: true,
        assignedTrainer: assignedTrainer || null,
        createdBy: closedBy || null
    });

    // Update member details
    member.packageName = packageName;
    member.durationMonths = durationMonths;
    member.startDate = new Date(startDate);
    member.endDate = new Date(endDate);
    member.totalAmount += Number(amount);
    member.paidAmount += Number(paidAmount);
    member.dueAmount = member.totalAmount - member.paidAmount;
    member.discount += Number(discount || 0);
    member.status = 'Active';
    await member.save();

    // Create Sale record
    await Sale.create({
        memberId: member._id,
        amount: paidAmount,
        subTotal: subTotal || amount,
        taxAmount: taxAmount || 0,
        discountAmount: discount || 0,
        paymentMode: paymentMode || 'Cash',
        trainerId: assignedTrainer || null,
        closedBy: closedBy || null,
        type: 'Upgrade',
        description: `Upgraded to ${packageName}.`
    });

    res.json({ message: 'Membership upgraded successfully', subscription });
});

// @desc    Transfer Membership
// @route   POST /api/admin/members/:id/transfer
// @access  Private/Admin
const transferMembership = asyncHandler(async (req, res) => {
    const {
        transferToMemberId, // Destination member ID (ObjectId)
        transferCharge,
        paymentMode,
        comment,
        closedBy
    } = req.body;

    const sourceMember = await Member.findById(req.params.id);
    const targetMember = await Member.findById(transferToMemberId);

    if (!sourceMember || !targetMember) {
        res.status(404);
        throw new Error('Source or Target member not found');
    }

    const subscription = await Subscription.findOne({ memberId: sourceMember._id, isCurrent: true });
    if (!subscription) {
        res.status(400);
        throw new Error('No active subscription found to transfer');
    }

    // 1. Mark source subscription as Transferred
    subscription.status = 'Transferred';
    subscription.isCurrent = false;
    await subscription.save();

    // 2. Update source member status
    sourceMember.status = 'Inactive';
    await sourceMember.save();

    // 3. Create new subscription for target member (cloning current details)
    await Subscription.updateMany({ memberId: targetMember._id }, { isCurrent: false });
    const newSubscription = await Subscription.create({
        memberId: targetMember._id,
        packageName: subscription.packageName,
        duration: subscription.duration,
        startDate: new Date(), // Start from today
        endDate: subscription.endDate,
        totalAmount: 0, // It's a transfer, financial history remains with source or handled via transfer charge
        paidAmount: 0,
        status: 'Active',
        isCurrent: true,
        assignedTrainer: subscription.assignedTrainer,
        createdBy: closedBy || null,
        remarks: `Transferred from ${sourceMember.firstName} ${sourceMember.lastName}. ${comment || ''}`
    });

    // 4. Update target member details
    targetMember.packageName = subscription.packageName;
    targetMember.startDate = newSubscription.startDate;
    targetMember.endDate = newSubscription.endDate;
    targetMember.status = 'Active';
    await targetMember.save();

    // 5. Create Sale record for transfer charge
    if (Number(transferCharge) > 0) {
        await Sale.create({
            memberId: sourceMember._id,
            amount: transferCharge,
            subTotal: req.body.subTotal || transferCharge,
            taxAmount: req.body.taxAmount || 0,
            paymentMode: paymentMode || 'Cash',
            type: 'Transfer Charge',
            description: `Membership transferred to ${targetMember.firstName} ${targetMember.lastName}.`,
            closedBy: closedBy || null
        });
    }

    res.json({ message: 'Membership transferred successfully', targetMember });
});

// @desc    Bulk Deactivate Members
// @route   PUT /api/admin/members/bulk-deactivate
// @access  Private/Admin
const bulkDeactivateMembers = asyncHandler(async (req, res) => {
    const { memberIds } = req.body;
    if (!memberIds || !Array.isArray(memberIds)) {
        res.status(400);
        throw new Error('Please provide an array of member IDs');
    }

    await Member.updateMany(
        { _id: { $in: memberIds } },
        { status: 'Inactive' }
    );

    res.json({ message: 'Members deactivated successfully' });
});

// @desc    Bulk Assign Trainer
// @route   PUT /api/admin/members/bulk-assign-trainer
// @access  Private/Admin
const bulkAssignTrainer = asyncHandler(async (req, res) => {
    const { memberIds, trainerId } = req.body;
    if (!memberIds || !Array.isArray(memberIds) || !trainerId) {
        res.status(400);
        throw new Error('Please provide an array of member IDs and a trainer ID');
    }

    await Member.updateMany(
        { _id: { $in: memberIds } },
        { assignedTrainer: trainerId }
    );

    res.json({ message: 'Trainer assigned successfully' });
});

// @desc    Pay Due Balance for a subscription
// @route   PUT /api/admin/members/subscriptions/:subscriptionId/pay-due
// @access  Private/Admin
const payDue = asyncHandler(async (req, res) => {
    const { amount, paymentMode, closedBy } = req.body;
    const { subscriptionId } = req.params;

    if (!amount || amount <= 0) {
        res.status(400);
        throw new Error('Please provide a valid payment amount');
    }

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
        res.status(404);
        throw new Error('Subscription not found');
    }

    const member = await Member.findById(subscription.memberId);
    if (!member) {
        res.status(404);
        throw new Error('Member not found');
    }

    // 1. Update Subscription
    subscription.paidAmount += Number(amount);
    // dueAmount is auto-calculated in pre-save
    await subscription.save();

    // 2. Update Member (Master Record)
    member.paidAmount += Number(amount);
    // dueAmount is auto-calculated in pre-save
    await member.save();

    // 3. Create Sale record
    await Sale.create({
        memberId: member._id,
        amount: Number(amount),
        subTotal: Number(amount),
        taxAmount: 0,
        paymentMode: paymentMode || 'Cash',
        type: 'Due Payment',
        description: `Due payment for ${subscription.packageName} package.`,
        closedBy: closedBy || null
    });

    res.json({
        message: 'Payment recorded successfully',
        subscription,
        member
    });
});

// @desc    Pay Due Balance at Member Level (applies to oldest dues first)
// @route   PUT /api/admin/members/:id/pay-due
// @access  Private/Admin
const payDueMember = asyncHandler(async (req, res) => {
    const { amount, paymentMode, closedBy } = req.body;
    const member = await Member.findById(req.params.id);

    if (!member) {
        res.status(404);
        throw new Error('Member not found');
    }

    const payAmount = Number(amount);
    if (isNaN(payAmount) || payAmount <= 0) {
        res.status(400);
        throw new Error('Please provide a valid payment amount');
    }

    // Find all subscriptions for this member
    let subscriptions = await Subscription.find({ memberId: member._id }).sort({ createdAt: 1 });

    if (subscriptions.length === 0) {
        res.status(400);
        throw new Error('No subscriptions found for this member to apply payment to');
    }

    let remainingToApply = payAmount;
    const updatedSubscriptions = [];

    // First, try to apply to subscriptions that actually show a dueAmount > 0
    for (const sub of subscriptions) {
        if (remainingToApply <= 0) break;

        // Use totalAmount - paidAmount directly in case dueAmount is out of sync
        const actualDue = sub.totalAmount - sub.paidAmount;
        if (actualDue > 0) {
            const paymentToApply = Math.min(remainingToApply, actualDue);
            sub.paidAmount += paymentToApply;
            remainingToApply -= paymentToApply;
            await sub.save();
            updatedSubscriptions.push(sub);
        }
    }

    // If there's still money left (maybe data was out of sync), apply to the most recent subscription anyway
    if (remainingToApply > 0) {
        const lastSub = subscriptions[subscriptions.length - 1];
        lastSub.paidAmount += remainingToApply;
        remainingToApply = 0;
        await lastSub.save();
        if (!updatedSubscriptions.find(s => s._id.toString() === lastSub._id.toString())) {
            updatedSubscriptions.push(lastSub);
        }
    }

    // Update Member master record
    member.paidAmount += payAmount;
    await member.save();

    // Create Sale record
    await Sale.create({
        memberId: member._id,
        amount: payAmount,
        subTotal: payAmount,
        taxAmount: 0,
        paymentMode: paymentMode || 'Cash',
        type: 'Due Payment',
        description: `Due payment for member ${member.firstName} ${member.lastName}. Applied to ${updatedSubscriptions.length} subscriptions.`,
        closedBy: closedBy || null
    });

    res.json({
        message: 'Payment recorded successfully',
        member,
        paid: payAmount,
        newDue: member.totalAmount - member.paidAmount
    });
});

module.exports = {
    getMembers,
    getMemberById,
    createMember,
    updateMember,
    deleteMember,
    getMemberStats,
    renewMembership,
    createFreshSale,
    extendMembership,
    changeStartDate,
    getMemberSubscriptions,
    freezeMembership,
    upgradeMembership,
    transferMembership,
    bulkDeactivateMembers,
    bulkAssignTrainer,
    payDue,
    payDueMember
};

