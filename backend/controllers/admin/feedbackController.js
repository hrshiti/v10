const asyncHandler = require('express-async-handler');
const Feedback = require('../../models/Feedback');

// @desc    Create Feedback (User Side)
// @route   POST /api/user/feedback
// @access  Public (or Private if User Auth exists)
const createFeedback = asyncHandler(async (req, res) => {
    const { userId, userName, type, message, rating } = req.body;

    const feedback = await Feedback.create({
        userId,
        userName,
        type,
        message,
        rating
    });

    res.status(201).json(feedback);
});

// @desc    Get All Feedbacks (Admin Side)
// @route   GET /api/admin/feedback
// @access  Private/Admin
const getFeedbacks = asyncHandler(async (req, res) => {
    // Optional filter by status
    const filter = req.query.status ? { status: req.query.status } : {};

    const feedbacks = await Feedback.find(filter)
        .populate('userId', 'firstName lastName mobile') // Fetch member details
        .sort({ createdAt: -1 });
    res.json(feedbacks);
});

// @desc    Reply to Feedback (Admin Side)
// @route   PUT /api/admin/feedback/:id/reply
// @access  Private/Admin
const replyToFeedback = asyncHandler(async (req, res) => {
    const { replyMessage } = req.body;
    const feedback = await Feedback.findById(req.params.id);

    if (feedback) {
        feedback.replyMessage = replyMessage;
        feedback.replyDate = Date.now();
        feedback.repliedBy = 'Admin'; // In real app, get from req.admin.name
        feedback.status = 'Replied';

        const updatedFeedback = await feedback.save();

        // TODO: Here you would integrate Socket.io or Push Notification to notify the user

        res.json(updatedFeedback);
    } else {
        res.status(404);
        throw new Error('Feedback not found');
    }
});

// @desc    Get Feedback Stats for Dashboard
// @route   GET /api/admin/feedback/stats
const getFeedbackStats = asyncHandler(async (req, res) => {
    const total = await Feedback.countDocuments({});
    const newFeedback = await Feedback.countDocuments({ status: 'New' });
    const complaints = await Feedback.countDocuments({ type: 'Complaint' });

    res.json({
        total,
        new: newFeedback,
        complaints
    });
});

module.exports = {
    createFeedback,
    getFeedbacks,
    replyToFeedback,
    getFeedbackStats
};
