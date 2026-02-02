const express = require('express');
const router = express.Router();
const { getSales, getSalesByMember } = require('../../controllers/admin/saleController');

router.get('/', getSales);
router.get('/member/:memberId', getSalesByMember);

module.exports = router;
