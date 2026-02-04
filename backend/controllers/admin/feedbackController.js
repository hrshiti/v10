const asyncHandler = require('express-async-handler');
const Feedback = require('../../models/Feedback');

// @desc    Create Feedback (User Side)
// @route   POST /api/user/feedback
// @access  Public (or Private if User Auth exists)
const createFeedback = async (req, res) => {
    try {
        console.log('Incoming Feedback:', req.body);
        const { userId, userName, type, message, rating } = req.body;

        if (!userId || !message) {
            return res.status(400).json({ message: 'Missing required fields (UserId or Message)' });
        }

        const feedback = await Feedback.create({
            userId,
            userName,
            type,
            message,
            rating
        });

        console.log('Feedback Created Successfully:', feedback.feedbackId);
        return res.status(201).json(feedback);

    } catch (error) {
        console.error('Feedback Creation Error:', error);
        return res.status(500).json({
            message: error.message || 'Internal Server Error during feedback creation',
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

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
        feedback.repliedBy = req.admin?.name || 'Admin';
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

// @desc    Get user's own feedback history
// @route   GET /api/admin/feedback/user/:userId
const getMyFeedbacks = asyncHandler(async (req, res) => {
    const feedbacks = await Feedback.find({ userId: req.params.userId })
        .sort({ createdAt: -1 });
    res.json(feedbacks);
});

module.exports = {
    createFeedback,
    getFeedbacks,
    replyToFeedback,
    getFeedbackStats,
    getMyFeedbacks
};
