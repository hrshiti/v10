const express = require('express');
const router = express.Router();
const {
    createFeedback,
    getFeedbacks,
    replyToFeedback,
    getFeedbackStats
} = require('../../controllers/admin/feedbackController');

// Admin Routes
router.get('/', getFeedbacks);
router.get('/stats', getFeedbackStats);
router.put('/:id/reply', replyToFeedback);

// Public/User Route (To submit)
router.post('/submit', createFeedback);

module.exports = router;
