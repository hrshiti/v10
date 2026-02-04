const asyncHandler = require('express-async-handler');
const FollowUp = require('../../models/FollowUp');

// @desc    Get all follow-ups with pagination and filtering
// @route   GET /api/admin/follow-ups
// @access  Private/Admin
const getFollowUps = asyncHandler(async (req, res) => {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;
    const isDone = req.query.isDone === 'true';
    const type = req.query.type;
    const status = req.query.status;
    const keyword = req.query.keyword;
    const memberId = req.query.memberId;
    const enquiryId = req.query.enquiryId;

    const query = {};

    if (memberId) {
        query.memberId = memberId;
    } else if (enquiryId) {
        query.enquiryId = enquiryId;
    } else {
        query.isDone = req.query.isDone === 'true';
    }

    if (type) query.type = type;
    if (status) query.status = status;
    if (keyword) {
        query.$or = [
            { name: { $regex: keyword, $options: 'i' } },
            { number: { $regex: keyword, $options: 'i' } },
            { comment: { $regex: keyword, $options: 'i' } }
        ];
    }

    const count = await FollowUp.countDocuments(query);
    const followUps = await FollowUp.find(query)
        .populate('handledBy', 'firstName lastName')
        .populate('enquiryId', 'enquiryId')
        .populate('memberId', 'memberId')
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort({ dateTime: 1 }); // Sort by upcoming follow-up time

    res.json({ followUps, page, pages: Math.ceil(count / pageSize), total: count });
});

// @desc    Create a new follow-up
// @route   POST /api/admin/follow-ups
// @access  Private/Admin
const createFollowUp = asyncHandler(async (req, res) => {
    const {
        name,
        number,
        type,
        dateTime,
        status,
        comment,
        enquiryId,
        memberId,
        handledBy
    } = req.body;

    console.log('Creating follow-up with payload:', req.body);

    const followUp = new FollowUp({
        name,
        number,
        type,
        dateTime,
        status: status || 'Hot',
        comment,
        enquiryId: enquiryId || undefined,
        memberId: memberId || undefined,
        handledBy: handledBy || undefined,
        createdBy: 'Admin'
    });

    try {
        const createdFollowUp = await followUp.save();
        res.status(201).json(createdFollowUp);
    } catch (error) {
        console.error('Error saving follow-up:', error);
        res.status(400).json({ message: error.message });
    }
});

// @desc    Mark follow-up as done
// @route   PUT /api/admin/follow-ups/:id/done
// @access  Private/Admin
const markFollowUpDone = asyncHandler(async (req, res) => {
    const followUp = await FollowUp.findById(req.params.id);

    if (followUp) {
        followUp.isDone = true;
        await followUp.save();
        res.json({ message: 'Follow-up marked as done' });
    } else {
        res.status(404);
        throw new Error('Follow-up not found');
    }
});

// @desc    Delete follow-up
// @route   DELETE /api/admin/follow-ups/:id
// @access  Private/Admin
const deleteFollowUp = asyncHandler(async (req, res) => {
    const followUp = await FollowUp.findById(req.params.id);

    if (followUp) {
        await followUp.deleteOne();
        res.json({ message: 'Follow-up removed' });
    } else {
        res.status(404);
        throw new Error('Follow-up not found');
    }
});

// @desc    Update follow-up response
// @route   PUT /api/admin/follow-ups/:id
// @access  Private/Admin
const updateFollowUp = asyncHandler(async (req, res) => {
    const { status, comment } = req.body;
    const followUp = await FollowUp.findById(req.params.id);

    if (followUp) {
        followUp.status = status || followUp.status;
        followUp.comment = comment || followUp.comment;
        const updatedFollowUp = await followUp.save();
        res.json(updatedFollowUp);
    } else {
        res.status(404);
        throw new Error('Follow-up not found');
    }
});

module.exports = {
    getFollowUps,
    createFollowUp,
    markFollowUpDone,
    deleteFollowUp,
    updateFollowUp
};
