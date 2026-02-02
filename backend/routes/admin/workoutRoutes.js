const express = require('express');
const router = express.Router();
const { createWorkout, getMemberWorkout } = require('../../controllers/admin/workoutController');

router.route('/')
    .post(createWorkout);

router.route('/member/:memberId')
    .get(getMemberWorkout);

module.exports = router;
