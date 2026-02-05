const express = require('express');
const router = express.Router();
const {
    createWorkout,
    getWorkouts,
    updateWorkout,
    deleteWorkout,
    getMemberWorkout
} = require('../../controllers/admin/workoutController');

router.route('/')
    .post(createWorkout)
    .get(getWorkouts);

router.route('/:id')
    .put(updateWorkout)
    .delete(deleteWorkout);

router.route('/member/:memberId')
    .get(getMemberWorkout);

module.exports = router;
