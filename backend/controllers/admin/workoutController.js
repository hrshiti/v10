const asyncHandler = require('express-async-handler');
const Workout = require('../../models/Workout');
const Member = require('../../models/Member');

// @desc    Assign Workout to Member
// @route   POST /api/admin/workouts
// @access  Private/Admin
const createWorkout = asyncHandler(async (req, res) => {
    const { memberId, trainerId, name, startDate, endDate, schedule } = req.body;

    // Verify member exists
    const member = await Member.findById(memberId);
    if (!member) {
        res.status(404);
        throw new Error('Member not found');
    }

    // Archive previous active workouts for this member
    await Workout.updateMany(
        { memberId, status: 'Active' },
        { status: 'Archived' }
    );

    const workout = await Workout.create({
        memberId,
        trainerId,
        name,
        startDate,
        endDate,
        schedule
    });

    res.status(201).json(workout);
});

// @desc    Get Workout by Member ID
// @route   GET /api/admin/workouts/member/:memberId
// @access  Private/Admin
const getMemberWorkout = asyncHandler(async (req, res) => {
    const workouts = await Workout.find({ memberId: req.params.memberId })
        .populate('trainerId', 'firstName lastName')
        .sort({ createdAt: -1 });
    res.json(workouts);
});

// @desc    Get all active workouts
// @route   GET /api/admin/workouts
// @access  Private/Admin
const getWorkouts = asyncHandler(async (req, res) => {
    const workouts = await Workout.find({})
        .populate('memberId', 'firstName lastName memberId')
        .populate('trainerId', 'firstName lastName')
        .sort({ createdAt: -1 });
    res.json(workouts);
});

module.exports = { createWorkout, getMemberWorkout, getWorkouts };
