const express = require('express');
const router = express.Router();
const { userProtect } = require('../../middlewares/authMiddleware');
const { getDailyIntake, updateIntake } = require('../../controllers/user/waterIntakeController');

router.use(userProtect);

router.route('/')
    .get(getDailyIntake)
    .post(updateIntake);

module.exports = router;
