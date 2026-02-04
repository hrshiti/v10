const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getRecentFollowUps,
    getDashboardCharts
} = require('../../controllers/admin/dashboardController');
const { protect } = require('../../middlewares/authMiddleware');

router.get('/stats', protect, getDashboardStats);
router.get('/follow-ups', protect, getRecentFollowUps);
router.get('/charts', protect, getDashboardCharts);

module.exports = router;
