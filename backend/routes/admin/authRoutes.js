const express = require('express');
const router = express.Router();
const { authAdmin, registerAdmin, forgotPassword, saveFCMToken } = require('../../controllers/admin/authController');
const { protect } = require('../../middlewares/authMiddleware');

router.post('/login', authAdmin);
router.post('/register', protect, registerAdmin);
router.post('/forgot-password', forgotPassword);
router.put('/fcm-token', protect, saveFCMToken);

// Example of protected route check
router.get('/me', protect, (req, res) => {
    res.json(req.admin);
});

module.exports = router;
