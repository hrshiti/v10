const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getRecentFollowUps,
    getDashboardCharts
} = require('../../controllers/admin/dashboardController');

router.get('/stats', getDashboardStats);
router.get('/follow-ups', getRecentFollowUps);
router.get('/charts', getDashboardCharts);

module.exports = router;
