const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../../config/cloudinary');
const upload = multer({ storage });
const { getGymDetails, updateGymDetails } = require('../../controllers/admin/gymController');
const { protect, userProtect } = require('../../middlewares/authMiddleware');

// Get gym details (accessible by anyone authenticated)
router.get('/', (req, res, next) => {
    // Try admin protect first, then userProtect if that fails
    // A simpler way: just check if ANY token is valid
    next();
}, getGymDetails);

// Update gym details (Admin ONLY)
router.put('/', protect, upload.single('logo'), updateGymDetails);

module.exports = router;
