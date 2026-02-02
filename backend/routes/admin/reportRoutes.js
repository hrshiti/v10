const express = require('express');
const router = express.Router();
const {
    getSalesReport,
    getBalanceDueReport,
    getMembershipExpiryReport
} = require('../../controllers/admin/reportController');

router.get('/sales', getSalesReport);
router.get('/balance-due', getBalanceDueReport);
router.get('/membership-expiry', getMembershipExpiryReport);

module.exports = router;
