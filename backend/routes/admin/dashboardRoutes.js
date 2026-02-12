const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getCommitmentDues,
    getDashboardCharts,
    getLiveGymStatus
} = require('../../controllers/admin/dashboardController');
const { protect } = require('../../middlewares/authMiddleware');

router.get('/stats', protect, getDashboardStats);
router.get('/commitment-dues', protect, getCommitmentDues);
router.get('/charts', protect, getDashboardCharts);
router.get('/live-gym', protect, getLiveGymStatus);

module.exports = router;
