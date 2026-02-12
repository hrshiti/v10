const express = require('express');
const router = express.Router();
const { getSales, getSalesByMember, getSaleByInvoiceNumber, deleteSale } = require('../../controllers/admin/saleController');
const { protect } = require('../../middlewares/authMiddleware');

router.use(protect);

router.get('/', getSales);
router.get('/member/:memberId', getSalesByMember);
router.get('/invoice/:invoiceNumber', getSaleByInvoiceNumber);
router.delete('/:id', deleteSale);

module.exports = router;
