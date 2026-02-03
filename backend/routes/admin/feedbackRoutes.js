const express = require('express');
const router = express.Router();
const {
    createFeedback,
    getFeedbacks,
    replyToFeedback,
    getFeedbackStats,
    getMyFeedbacks
} = require('../../controllers/admin/feedbackController');

// Admin Routes
router.get('/', getFeedbacks);
router.get('/stats', getFeedbackStats);
router.put('/:id/reply', replyToFeedback);
router.get('/user/:userId', getMyFeedbacks);

// Public/User Route (To submit)
router.post('/submit', createFeedback);

module.exports = router;
