const express = require('express');
const router = express.Router();
const { getSales, getSalesByMember, getSaleByInvoiceNumber } = require('../../controllers/admin/saleController');
const { protect } = require('../../middlewares/authMiddleware');

router.use(protect);

router.get('/', getSales);
router.get('/member/:memberId', getSalesByMember);
router.get('/invoice/:invoiceNumber', getSaleByInvoiceNumber);

module.exports = router;
