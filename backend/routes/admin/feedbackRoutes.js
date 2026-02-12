const express = require('express');
const router = express.Router();
const {
    createFeedback,
    getFeedbacks,
    replyToFeedback,
    getFeedbackStats,
    getMyFeedbacks,
    deleteFeedback
} = require('../../controllers/admin/feedbackController');

const { protect, userProtect } = require('../../middlewares/authMiddleware');

// Admin Routes
router.get('/', protect, getFeedbacks);
router.get('/stats', protect, getFeedbackStats);
router.put('/:id/reply', protect, replyToFeedback);
router.delete('/:id', protect, deleteFeedback);
router.get('/user/:userId', protect, getMyFeedbacks);

// Public/User Route (To submit)
router.post('/submit', userProtect, createFeedback);

module.exports = router;
