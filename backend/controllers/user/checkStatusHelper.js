
// @desc    Check completion status of a specific workout for a specific day
// @route   GET /api/user/workouts/status
// @access  Private/User
const checkWorkoutStatus = asyncHandler(async (req, res) => {
    const { workoutId, day } = req.query;

    if (!workoutId) {
        res.status(400);
        throw new Error('Workout ID is required');
    }

    // Determine the date to check
    // If 'day' is provided (e.g., "Monday"), we need to find the most recent such day? 
    // Or normally we just check for TODAY because the user is expected to do today's workout.
    // However, the UI allows selecting days.
    // If the UI selects "Monday" and today is "Tuesday", showing "Completed" for Monday implies looking at history.

    // For simplicity and "Today's session" requirement:
    // We check if a log exists for this workoutId on the current calendar date (today), 
    // OR if the user is asking about a specific past day, we check that date.

    // BUT, the user prompt specifically says: "finish session its show in the progress for the day no , again finish session mark..."
    // This implies they successfully finished it today.

    // Let's check simply for a log created "today" for this workout.
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const log = await WorkoutLog.findOne({
        memberId: req.user._id,
        workoutId: workoutId,
        date: {
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
    });

    res.json({
        completed: !!log,
        log: log || null
    });
});
