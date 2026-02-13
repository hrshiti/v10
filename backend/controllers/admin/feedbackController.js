const asyncHandler = require('express-async-handler');
const Feedback = require('../../models/Feedback');
const Member = require('../../models/Member');
const Admin = require('../../models/Admin');
const GymDetail = require('../../models/GymDetail');
const { sendPushNotification, sendMulticastNotification } = require('../../utils/pushNotification');

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

        // Notify Admins
        try {
            const gym = await GymDetail.findOne();
            const logoIcon = gym?.logo || 'https://res.cloudinary.com/db776v7px/image/upload/v1738745269/gym_logo_v10.png';

            const admins = await Admin.find({ fcmTokens: { $exists: true } });
            const tokens = admins.flatMap(a => [a.fcmTokens?.web, a.fcmTokens?.app]).filter(t => t);

            if (tokens.length > 0) {
                await sendMulticastNotification(
                    tokens,
                    'New Feedback Received',
                    `${userName || 'A member'} has sent a new ${type.toLowerCase()}.: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`,
                    { click_action: '/admin/feedback', icon: logoIcon }
                );
            }
        } catch (err) {
            console.error('Error notifying admins about feedback:', err);
        }

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

        // Notify User
        try {
            const gym = await GymDetail.findOne();
            const logoIcon = gym?.logo || 'https://res.cloudinary.com/db776v7px/image/upload/v1738745269/gym_logo_v10.png';

            const member = await Member.findById(feedback.userId);
            if (member && member.fcmTokens) {
                const tokens = [member.fcmTokens.web, member.fcmTokens.app].filter(t => t);
                if (tokens.length > 0) {
                    await sendMulticastNotification(
                        tokens,
                        'Reply to your feedback',
                        `The admin has replied to your feedback: "${replyMessage.substring(0, 50)}${replyMessage.length > 50 ? '...' : ''}"`,
                        { click_action: '/profile', icon: logoIcon }
                    );
                }
            }
        } catch (err) {
            console.error('Error notifying user about reply:', err);
        }

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

// @desc    Delete Feedback
// @route   DELETE /api/admin/feedback/:id
// @access  Private/Admin
const deleteFeedback = asyncHandler(async (req, res) => {
    const feedback = await Feedback.findById(req.params.id);

    if (feedback) {
        await feedback.deleteOne();
        res.json({ message: 'Feedback removed' });
    } else {
        res.status(404);
        throw new Error('Feedback not found');
    }
});

module.exports = {
    createFeedback,
    getFeedbacks,
    replyToFeedback,
    getFeedbackStats,
    getMyFeedbacks,
    deleteFeedback
};
