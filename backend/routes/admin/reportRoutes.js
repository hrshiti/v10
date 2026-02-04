const express = require('express');
const router = express.Router();
const {
    getSalesReport,
    getBalanceDueReport,
    getMembershipExpiryReport,
    getSubscriptionAnalytics,
    getAttendanceReport,
    getDueMembershipReport
} = require('../../controllers/admin/reportController');
const { protect } = require('../../middlewares/authMiddleware');

router.use(protect);

router.get('/sales', getSalesReport);
router.get('/balance-due', getBalanceDueReport);
router.get('/membership-expiry', getMembershipExpiryReport);
router.get('/subscription-analytics', getSubscriptionAnalytics);
router.get('/attendance', getAttendanceReport);
router.get('/due-membership', getDueMembershipReport);

module.exports = router;
