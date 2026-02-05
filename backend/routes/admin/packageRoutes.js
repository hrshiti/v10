const express = require('express');
const router = express.Router();
const { getPackages, createPackage, updatePackage, deletePackage } = require('../../controllers/admin/packageController');

const { protect } = require('../../middlewares/authMiddleware');

router.use(protect); // Protect all routes in this file

router.route('/')
    .get(getPackages)
    .post(createPackage);

router.route('/:id')
    .put(updatePackage)
    .delete(deletePackage);

module.exports = router;
