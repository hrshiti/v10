const asyncHandler = require('express-async-handler');
const Member = require('../../models/Member');
const MemberAttendance = require('../../models/MemberAttendance');
const DietPlan = require('../../models/DietPlan');
const Workout = require('../../models/Workout');
const Feedback = require('../../models/Feedback');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private/User
const getUserProfile = asyncHandler(async (req, res) => {
    const member = await Member.findById(req.user._id);

    if (member) {
        res.json(member);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Mark attendance via user's phone (scanning a gym QR)
// @route   POST /api/user/attendance/scan
// @access  Private/User
const userScanQR = asyncHandler(async (req, res) => {
    const { gymId } = req.body; // In a real scenario, the QR contains the gym's code or similar verification

    // For this simple case, we assume scanning ANY valid QR from the gym works
    const member = req.user;

    if (member.status !== 'Active') {
        res.status(400);
        throw new Error('Your membership is not active. Please contact admin.');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already marked
    const existingAttendance = await MemberAttendance.findOne({
        memberId: member._id,
        date: {
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
    });

    if (existingAttendance) {
        if (!existingAttendance.checkOut) {
            existingAttendance.checkOut = new Date();
            await existingAttendance.save();
            return res.json({
                success: true,
                message: 'Check-out marked successfully',
                type: 'checkout'
            });
        } else {
            return res.json({
                success: false,
                message: 'Attendance already completed for today'
            });
        }
    }

    // Mark new attendance
    await MemberAttendance.create({
        memberId: member._id,
        date: new Date(),
        checkIn: new Date(),
        status: 'Present',
        method: 'QR'
    });

    res.status(201).json({
        success: true,
        message: 'Attendance marked successfully',
        type: 'checkin'
    });
});

// @desc    Get user's attendance logs
// @route   GET /api/user/attendance
// @access  Private/User
const getUserAttendance = asyncHandler(async (req, res) => {
    const logs = await MemberAttendance.find({ memberId: req.user._id })
        .sort({ date: -1 });
    res.json(logs);
});

// @desc    Get assigned diet plan
// @route   GET /api/user/diet-plan
// @access  Private/User
const getUserDietPlan = asyncHandler(async (req, res) => {
    const dietPlan = await DietPlan.findOne({ assignedMembers: req.user._id });
    res.json(dietPlan);
});

// @desc    Get user's workouts
// @route   GET /api/user/workouts
// @access  Private/User
const getUserWorkouts = asyncHandler(async (req, res) => {
    const workouts = await Workout.find({ memberId: req.user._id });
    res.json(workouts);
});

const WorkoutLog = require('../../models/WorkoutLog');

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private/User
const updateUserProfile = asyncHandler(async (req, res) => {
    console.log('Update Profile Req Body:', req.body);
    console.log('Update Profile Req File:', req.file);

    try {
        const member = await Member.findById(req.user._id);

        if (member) {
            // Handle name if provided
            if (req.body.name) {
                const nameParts = req.body.name.trim().split(' ');
                member.firstName = nameParts[0] || member.firstName;
                member.lastName = nameParts.slice(1).join(' ') || member.lastName;
            }

            member.email = req.body.email || member.email;

            // Helper to handle numeric fields safely
            const updateNumericField = (field, value) => {
                if (value !== undefined && value !== 'undefined' && value !== null && value !== '') {
                    const num = Number(value);
                    if (!isNaN(num)) {
                        member[field] = num;
                    }
                }
            };

            updateNumericField('weight', req.body.weight);
            updateNumericField('height', req.body.height);
            updateNumericField('age', req.body.age);

            // Handle profile photo upload
            if (req.file) {
                member.photo = req.file.path; // Cloudinary URL
            }

            const updatedMember = await member.save();
            console.log('Profile updated successfully:', updatedMember.memberId);
            res.json(updatedMember);
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        console.error('SERVER PROFILE UPDATE ERROR:', error);
        res.status(400);
        throw new Error(error.message || 'Profile update failed');
    }
});

// @desc    Log completed workout
// @route   POST /api/user/workouts/log
// @access  Private/User
const logWorkoutCompletion = asyncHandler(async (req, res) => {
    const { workoutId, completedExercises } = req.body;

    const log = await WorkoutLog.create({
        memberId: req.user._id,
        workoutId,
        completedExercises,
        date: new Date()
    });

    res.status(201).json(log);
});

const getWorkoutStats = asyncHandler(async (req, res) => {
    // Basic logic: count completions in last 7 days vs target
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const logs = await WorkoutLog.countDocuments({
        memberId: req.user._id,
        date: { $gte: sevenDaysAgo }
    });

    // Get current day of week
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = days[new Date().getDay()];

    // Find active workout and today's type
    const activeWorkout = await Workout.findOne({ memberId: req.user._id, status: 'Active' });
    let todayType = 'Cardio'; // Default
    let activeWorkoutId = null;
    let target = 5; // Default fallback

    if (activeWorkout) {
        activeWorkoutId = activeWorkout._id;
        const todaySchedule = activeWorkout.schedule.find(s => s.day === todayName);
        if (todaySchedule && todaySchedule.workoutType) {
            todayType = todaySchedule.workoutType;
        }

        // Dynamically set target based on workout days in the plan
        const workoutDaysCount = activeWorkout.schedule.filter(s => s.exercises && s.exercises.length > 0).length;
        if (workoutDaysCount > 0) {
            target = workoutDaysCount;
        }
    }

    // Calculate progress percentage
    const progress = Math.min((logs / target) * 100, 100);

    res.json({
        completions: logs,
        progress: Math.round(progress),
        target: target,
        todayType: todayType,
        activeWorkoutId: activeWorkoutId
    });
});



// @desc    Submit feedback
// @route   POST /api/user/feedback
// @access  Private/User
const submitFeedback = asyncHandler(async (req, res) => {
    const { type, message, rating } = req.body;
    const member = req.user;

    const feedback = await Feedback.create({
        userId: member._id,
        userName: `${member.firstName} ${member.lastName}`,
        type,
        message,
        rating
    });

    res.status(201).json(feedback);
});

// @desc    Get user's feedback history
// @route   GET /api/user/feedback
// @access  Private/User
const getUserFeedbacks = asyncHandler(async (req, res) => {
    const feedbacks = await Feedback.find({ userId: req.user._id })
        .sort({ createdAt: -1 });
    res.json(feedbacks);
});

// @desc    Get dashboard stats for user home screen
// @route   GET /api/user/stats
// @access  Private/User
const getHomeStats = asyncHandler(async (req, res) => {
    const totalMembers = await Member.countDocuments({});
    const activeMembers = await Member.countDocuments({ status: 'Active' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayAttendance = await MemberAttendance.countDocuments({
        date: {
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
    });

    // Check current user's attendance status
    const userAttendance = await MemberAttendance.findOne({
        memberId: req.user._id,
        date: {
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
    });

    res.json({
        totalMembers,
        activeMembers,
        todayAttendance,
        userStatus: {
            isPresent: !!userAttendance,
            type: userAttendance ? (userAttendance.checkOut ? 'checkout' : 'checkin') : null
        }
    });
});

module.exports = {
    getUserProfile,
    userScanQR,
    getUserAttendance,
    getUserDietPlan,
    getUserWorkouts,
    updateUserProfile,
    logWorkoutCompletion,
    getWorkoutStats,
    submitFeedback,
    getUserFeedbacks,
    getHomeStats
};
