const express = require('express');
const router = express.Router();
const {
    getEnquiries,
    getEnquiryStats,
    createEnquiry,
    updateEnquiry,
    deleteEnquiry
} = require('../../controllers/admin/enquiryController');

router.route('/')
    .get(getEnquiries)
    .post(createEnquiry);

router.get('/stats', getEnquiryStats);

router.route('/:id')
    .put(updateEnquiry)
    .delete(deleteEnquiry);

module.exports = router;
