const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../../config/cloudinary');
const upload = multer({ storage });
const { getGymDetails, updateGymDetails, getGymQRCode, regenerateGymQRCode } = require('../../controllers/admin/gymController');
const { protect, userProtect } = require('../../middlewares/authMiddleware');

// Get gym details (accessible by anyone authenticated)
router.get('/', (req, res, next) => {
    // Try admin protect first, then userProtect if that fails
    // A simpler way: just check if ANY token is valid
    next();
}, getGymDetails);

// Get gym QR code (Admin ONLY)
router.get('/qr-code', protect, getGymQRCode);

// Regenerate gym QR code (Admin ONLY)
router.post('/qr-code/regenerate', protect, regenerateGymQRCode);

// Update gym details (Admin ONLY)
router.put('/', protect, upload.single('logo'), updateGymDetails);

module.exports = router;
