const express = require('express');
const router = express.Router();
const { createWorkout, getMemberWorkout, getWorkouts } = require('../../controllers/admin/workoutController');

router.route('/')
    .post(createWorkout)
    .get(getWorkouts);

router.route('/member/:memberId')
    .get(getMemberWorkout);

module.exports = router;
