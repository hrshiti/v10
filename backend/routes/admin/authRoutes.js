const express = require('express');
const router = express.Router();
const { authAdmin, registerAdmin, forgotPassword } = require('../../controllers/admin/authController');
const { protect } = require('../../middlewares/authMiddleware');

router.post('/login', authAdmin);
router.post('/register', protect, registerAdmin);
router.post('/forgot-password', forgotPassword);

// Example of protected route check
router.get('/me', protect, (req, res) => {
    res.json(req.admin);
});

module.exports = router;
