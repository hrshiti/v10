const asyncHandler = require('express-async-handler');
const Workout = require('../../models/Workout');
const Member = require('../../models/Member');

// @desc    Create Workout Plan
// @route   POST /api/admin/workouts
// @access  Private/Admin
const createWorkout = asyncHandler(async (req, res) => {
    const { name, privacyMode, assignedMembers, trainerId, schedule } = req.body;

    if (!name || !schedule) {
        res.status(400);
        throw new Error('Please provide a name and schedule');
    }

    try {
        const workout = await Workout.create({
            name,
            privacyMode,
            assignedMembers: assignedMembers && assignedMembers.length > 0 ? assignedMembers : [],
            trainerId: trainerId || null,
            schedule
        });

        res.status(201).json(workout);
    } catch (error) {
        console.error('Workout Plan Creation Error:', error);
        res.status(500);
        throw new Error(error.message);
    }
});

// @desc    Get all active workout plans
// @route   GET /api/admin/workouts
// @access  Private/Admin
const getWorkouts = asyncHandler(async (req, res) => {
    const workouts = await Workout.find({ status: { $ne: 'Archived' } })
        .populate('assignedMembers', 'firstName lastName memberId')
        .populate('trainerId', 'firstName lastName')
        .sort({ createdAt: -1 });
    res.json(workouts);
});

// @desc    Update Workout Plan
// @route   PUT /api/admin/workouts/:id
// @access  Private/Admin
const updateWorkout = asyncHandler(async (req, res) => {
    const workout = await Workout.findById(req.params.id);

    if (workout) {
        workout.name = req.body.name || workout.name;
        workout.privacyMode = req.body.privacyMode || workout.privacyMode;
        workout.assignedMembers = req.body.assignedMembers || workout.assignedMembers;
        workout.schedule = req.body.schedule || workout.schedule;
        workout.status = req.body.status || workout.status;

        try {
            const updatedWorkout = await workout.save();
            const populatedWorkout = await Workout.findById(updatedWorkout._id)
                .populate('assignedMembers', 'firstName lastName memberId')
                .populate('trainerId', 'firstName lastName');
            res.json(populatedWorkout);
        } catch (error) {
            console.error('Workout Plan Update Error:', error);
            res.status(500);
            throw new Error(error.message);
        }
    } else {
        res.status(404);
        throw new Error('Workout plan not found');
    }
});

// @desc    Delete Workout Plan
// @route   DELETE /api/admin/workouts/:id
// @access  Private/Admin
const deleteWorkout = asyncHandler(async (req, res) => {
    const workout = await Workout.findById(req.params.id);

    if (workout) {
        await workout.deleteOne();
        res.json({ message: 'Workout plan removed' });
    } else {
        res.status(404);
        throw new Error('Workout plan not found');
    }
});

// @desc    Get Workout plan for a specific member
// @route   GET /api/admin/workouts/member/:memberId
// @access  Private/Admin
const getMemberWorkout = asyncHandler(async (req, res) => {
    const workout = await Workout.findOne({
        assignedMembers: req.params.memberId,
        status: 'Active'
    }).populate('trainerId', 'firstName lastName');

    if (workout) {
        res.json(workout);
    } else {
        res.status(404);
        res.json({ message: 'No active workout plan found for this member' });
    }
});

module.exports = {
    createWorkout,
    getWorkouts,
    updateWorkout,
    deleteWorkout,
    getMemberWorkout
};
