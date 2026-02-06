const express = require('express');
const router = express.Router();
const {
    createFeedback,
    getFeedbacks,
    replyToFeedback,
    getFeedbackStats,
    getMyFeedbacks
} = require('../../controllers/admin/feedbackController');

const { protect, userProtect } = require('../../middlewares/authMiddleware');

// Admin Routes
router.get('/', protect, getFeedbacks);
router.get('/stats', protect, getFeedbackStats);
router.put('/:id/reply', protect, replyToFeedback);
router.get('/user/:userId', protect, getMyFeedbacks);

// Public/User Route (To submit)
router.post('/submit', userProtect, createFeedback);

module.exports = router;
