const asyncHandler = require('express-async-handler');
const WorkoutLibrary = require('../../models/WorkoutLibrary');

// @desc    Get all workout library items
// @route   GET /api/admin/workout-library
// @access  Private/Admin
const getWorkoutLibrary = asyncHandler(async (req, res) => {
    const workouts = await WorkoutLibrary.find({}).sort({ createdAt: -1 });
    res.json(workouts);
});

// @desc    Create workout library item
// @route   POST /api/admin/workout-library
// @access  Private/Admin
const createWorkoutLibraryItem = asyncHandler(async (req, res) => {
    try {
        console.log('Create Workout Library Req Body:', req.body);
        const { title, category, intensity, level, duration, sets, reps, calories, description, tags } = req.body;

        let images = [];
        if (req.files && req.files.length > 0) {
            images = req.files.map(file => file.path);
        }

        const workout = await WorkoutLibrary.create({
            title,
            category,
            intensity,
            level,
            duration,
            sets,
            reps,
            calories: calories ? Number(calories) : 0,
            description,
            tags: tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : [],
            images
        });

        res.status(201).json(workout);
    } catch (error) {
        console.error('Create Workout Error:', error);
        res.status(400);
        throw new Error(error.message || 'Failed to create workout template');
    }
});

// @desc    Update workout library item
// @route   PUT /api/admin/workout-library/:id
// @access  Private/Admin
const updateWorkoutLibraryItem = asyncHandler(async (req, res) => {
    const workout = await WorkoutLibrary.findById(req.params.id);

    if (workout) {
        workout.title = req.body.title || workout.title;
        workout.category = req.body.category || workout.category;
        workout.intensity = req.body.intensity || workout.intensity;
        workout.level = req.body.level || workout.level;
        workout.duration = req.body.duration || workout.duration;
        workout.sets = req.body.sets || workout.sets;
        workout.reps = req.body.reps || workout.reps;
        workout.calories = req.body.calories !== undefined ? Number(req.body.calories) : workout.calories;
        workout.description = req.body.description || workout.description;
        workout.tags = req.body.tags ? (typeof req.body.tags === 'string' ? JSON.parse(req.body.tags) : req.body.tags) : workout.tags;
        workout.active = req.body.active !== undefined ? req.body.active : workout.active;

        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => file.path);
            workout.images = [...workout.images, ...newImages];
        }

        const updatedWorkout = await workout.save();
        res.json(updatedWorkout);
    } else {
        res.status(404);
        throw new Error('Workout library item not found');
    }
});

// @desc    Delete workout library item
// @route   DELETE /api/admin/workout-library/:id
// @access  Private/Admin
const deleteWorkoutLibraryItem = asyncHandler(async (req, res) => {
    const workout = await WorkoutLibrary.findById(req.params.id);

    if (workout) {
        await workout.deleteOne();
        res.json({ message: 'Workout removed from library' });
    } else {
        res.status(404);
        throw new Error('Workout library item not found');
    }
});

module.exports = {
    getWorkoutLibrary,
    createWorkoutLibraryItem,
    updateWorkoutLibraryItem,
    deleteWorkoutLibraryItem
};
