const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getRecentFollowUps,
    getDashboardCharts,
    getLiveGymStatus
} = require('../../controllers/admin/dashboardController');
const { protect } = require('../../middlewares/authMiddleware');

router.get('/stats', protect, getDashboardStats);
router.get('/follow-ups', protect, getRecentFollowUps);
router.get('/charts', protect, getDashboardCharts);
router.get('/live-gym', protect, getLiveGymStatus);

module.exports = router;
