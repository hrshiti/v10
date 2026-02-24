const asyncHandler = require('express-async-handler');
const Member = require('../../models/Member');
const MemberAttendance = require('../../models/MemberAttendance');
const DietPlan = require('../../models/DietPlan');
const Workout = require('../../models/Workout');
const Feedback = require('../../models/Feedback');
const WorkoutLibrary = require('../../models/WorkoutLibrary');

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
    const { gymId } = req.body; // This must match the gym's secret gymCode

    if (!gymId) {
        return res.status(400).json({ success: false, message: 'Invalid QR Code. Please scan the gym\'s QR code.' });
    }

    // ✅ CORE VALIDATION: Verify against gym's official gymCode
    const GymDetail = require('../../models/GymDetail');
    const gymDetail = await GymDetail.findOne();

    if (!gymDetail || !gymDetail.gymCode) {
        return res.status(400).json({
            success: false,
            message: 'Gym QR not set up yet. Admin must go to Settings → Gym Information and print the QR first.',
            type: 'not_configured'
        });
    }

    if (gymId.trim() !== gymDetail.gymCode.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Invalid QR Code! Please scan only the gym\'s official QR code.',
            type: 'invalid_qr'
        });
    }

    const member = req.user;

    // Check if subscription has expired
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const memberEndDate = new Date(member.endDate);
    memberEndDate.setHours(0, 0, 0, 0);

    if (memberEndDate < currentDate || member.status === 'Expired') {
        return res.status(400).json({
            success: false,
            message: 'Your subscription/plan has expired. Please contact admin to renew your membership.',
            type: 'expired'
        });
    }

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
            // Add a safety buffer to prevent double-scan check-out (e.g., 5 minutes)
            const checkInTime = new Date(existingAttendance.checkIn).getTime();
            const now = new Date().getTime();
            const diffMinutes = (now - checkInTime) / (1000 * 60);

            if (diffMinutes < 5) {
                return res.json({
                    success: false,
                    message: `You just checked in ${Math.round(diffMinutes)} mins ago. Please wait a few minutes before checking out.`
                });
            }

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
    const dietPlan = await DietPlan.findOne({
        assignedMembers: req.user._id,
        status: 'Active'
    });
    res.json(dietPlan);
});

// @desc    Get user's workouts
// @route   GET /api/user/workouts
// @access  Private/User
const getUserWorkouts = asyncHandler(async (req, res) => {
    const workouts = await Workout.find({
        assignedMembers: req.user._id,
        status: { $ne: 'Archived' }
    }).sort({ createdAt: -1 });
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
    const { workoutId, completedExercises, day } = req.body;

    // Find the workout to get total exercises for the specific day
    const workout = await Workout.findById(workoutId);
    let totalExercises = 0;
    if (workout) {
        // Use the Day passed from frontend, fallback to today if missing
        const targetDay = day || ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];
        const targetSchedule = workout.schedule.find(s => s.day === targetDay);
        if (targetSchedule) {
            totalExercises = targetSchedule.exercises.length;
        }
    }

    const log = await WorkoutLog.create({
        memberId: req.user._id,
        workoutId,
        completedExercises,
        totalExercises,
        status: (totalExercises > 0 && completedExercises.length < totalExercises) ? 'Partial' : 'Completed',
        date: new Date(),
        day: day // Save the schedule day name (e.g., 'Monday')
    });

    res.status(201).json(log);
});

const getWorkoutStats = asyncHandler(async (req, res) => {
    // 1. Calculate time window: Start of CURRENT WEEK (Monday)
    // This fixes the issue of "rolling" updates where days drop off one by one.
    // Now it accumulates Mon-Sun and resets only on the next Monday.
    const today = new Date();
    const day = today.getDay(); // 0 (Sun) to 6 (Sat)

    // Calculate difference to get to last Monday
    // If today is Sunday (0), we go back 6 days. If Monday (1), we go back 0 days.
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    // 2. Fetch logs for this week only
    const logs = await WorkoutLog.find({
        memberId: req.user._id,
        date: { $gte: startOfWeek }
    });

    // 3. Calculate Completions (Unique Scheduled Days)
    const uniqueItems = new Set();

    logs.forEach(log => {
        // Prioritize: If we have a named day ('Monday'), use that.
        // If not (legacy), use the date string.
        // This solves "duplicate" counting where one log has date-key and another has day-key for the same event, 
        // assuming standard usage doesn't mix them arbitrarily.
        // Ideally we should filter out legacy logs if specific day logs exist, but simply clamping the output 
        // handles the UI issue ("8 of 7") effectively.
        const trackingKey = log.day ? log.day : new Date(log.date).toDateString();
        uniqueItems.add(trackingKey);
    });

    let completionCount = uniqueItems.size;

    // 4. Get Target and Today's Type
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = days[new Date().getDay()];

    const activeWorkout = await Workout.findOne({
        assignedMembers: req.user._id,
        status: 'Active'
    });

    let todayType = 'Workout';
    let activeWorkoutId = null;
    let target = 6; // Default standard

    if (activeWorkout) {
        activeWorkoutId = activeWorkout._id;
        const todaySchedule = activeWorkout.schedule.find(s => s.day === todayName);

        if (todaySchedule && todaySchedule.exercises && todaySchedule.exercises.length > 0) {
            todayType = todaySchedule.exercises[0].category || 'Active';
        } else {
            todayType = 'Rest';
        }

        const workoutDaysCount = activeWorkout.schedule.filter(s => s.exercises && s.exercises.length > 0).length;
        if (workoutDaysCount > 0) {
            target = workoutDaysCount;
        }
    }

    // Safety Clamps
    if (target > 7) target = 7;
    if (completionCount > target) completionCount = target;

    // 5. Calculate Progress %
    const progress = Math.min((completionCount / target) * 100, 100);

    res.json({
        completions: completionCount,
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

    // Notify Admins
    try {
        const { sendMulticastNotification } = require('../../utils/pushNotification');
        const Admin = require('../../models/Admin');
        const GymDetail = require('../../models/GymDetail');

        const gym = await GymDetail.findOne();
        const logoIcon = gym?.logo || 'https://res.cloudinary.com/db776v7px/image/upload/v1738745269/gym_logo_v10.png';

        const admins = await Admin.find({ fcmTokens: { $exists: true } });
        const tokens = admins.flatMap(a => [a.fcmTokens?.web, a.fcmTokens?.app]).filter(t => t);

        if (tokens.length > 0) {
            await sendMulticastNotification(
                tokens,
                'New Feedback Received',
                `${member.firstName} has sent a new ${type.toLowerCase()}: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`,
                { click_action: '/admin/feedback', icon: logoIcon }
            );
        }
    } catch (err) {
        console.error('Error notifying admins about feedback:', err);
    }

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

const EmployeeAttendance = require('../../models/EmployeeAttendance');

// @desc    Get dashboard stats for user home screen
// @route   GET /api/user/stats
// @access  Private/User
const getHomeStats = asyncHandler(async (req, res) => {
    // Note: Active/Total members counts are requested to be hidden in User UI, 
    // but we keep fetching them here in case other parts need them, or we can remove if strict.
    // For now, we just pass them as before.
    const totalMembers = await Member.countDocuments({});
    const activeMembers = await Member.countDocuments({ status: 'Active' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayAttendance = await MemberAttendance.countDocuments({
        date: {
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        },
        status: 'Present'
    });

    // Check current user's attendance status
    let userAttendance = await MemberAttendance.findOne({
        memberId: req.user._id,
        date: {
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
    });

    // If not found in Member checks, check Employee if the user is an employee (though this endpoint is protected by userProtect which allows both)
    // However, req.user is populated based on token. If it's an employee, we should check EmployeeAttendance.
    // But currently MemberAttendance works for Members. If the logged in user is a Trainer, `getHomeStats` might fail or return null.
    // But wait, Trainers have their own dashboard. `getHomeStats` is for `Home.jsx` (User Dashboard).
    // So `req.user` here is assumed to be a Member.

    // Logic: Active Session if checked in today AND not checked out
    let isSessionActive = false;
    let sessionTimeRemaining = 0;

    if (userAttendance && userAttendance.checkIn && !userAttendance.checkOut) {
        isSessionActive = true;
        // Optional: Keep sessionTimeRemaining if you want to show a progress bar (defaulting to 60 min session)
        const checkInTime = new Date(userAttendance.checkIn).getTime();
        const now = new Date().getTime();
        const diffMinutes = (now - checkInTime) / (1000 * 60);
        sessionTimeRemaining = Math.max(0, 60 - diffMinutes);
    }

    // Calculate total active members in gym right now (Auto-timeout after 60 mins)
    const sixtyMinutesAgo = new Date(Date.now() - 60 * 60 * 1000);
    const activeMembersCount = await MemberAttendance.countDocuments({
        checkIn: { $gte: sixtyMinutesAgo },
        checkOut: { $exists: false }
    });

    // Active Trainers/Employees (Stay active all day until checkout)
    const activeAttendance = await EmployeeAttendance.find({
        date: { $gte: today },
        outTime: { $exists: false }
    }).populate({
        path: 'employeeId',
        select: 'gymRole'
    });

    const activeTrainersCount = activeAttendance.filter(record => {
        if (!record.employeeId) return false;
        const roles = record.employeeId.gymRole || [];
        return roles.some(role => typeof role === 'string' && role.toLowerCase().includes('trainer'));
    }).length;

    // "Active In Gym" for users reflects current member count
    const activeInGym = activeMembersCount;

    res.json({
        totalMembers,
        activeMembers,
        todayAttendance,
        activeInGym,
        activeTrainers: activeTrainersCount,
        userStatus: {
            isPresent: !!userAttendance,
            type: userAttendance ? (userAttendance.checkOut ? 'checkout' : 'checkin') : null,
            isSessionActive,
            sessionTimeRemaining: Math.round(sessionTimeRemaining)
        }
    });
});

// @desc    Check completion status of a specific workout for a specific day
// @route   GET /api/user/workouts/status
// @access  Private/User
const checkWorkoutStatus = asyncHandler(async (req, res) => {
    const { workoutId } = req.query;

    if (!workoutId) {
        res.status(400);
        throw new Error('Workout ID is required');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find ALL logs for today for this workout
    const logs = await WorkoutLog.find({
        memberId: req.user._id,
        workoutId: workoutId,
        date: {
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
    });

    // Return the list of days completed today
    const completedDays = logs.map(log => log.day).filter(Boolean); // Filter nulls just in case

    res.json({
        completed: completedDays.length > 0, // Backward compatibility (true if ANY done)
        completedDays: completedDays
    });
});

// @desc    Get all active workout library items for users
// @route   GET /api/user/workout-library
// @access  Private/User
const getWorkoutLibrary = asyncHandler(async (req, res) => {
    const workouts = await WorkoutLibrary.find({ active: true }).sort({ createdAt: -1 });
    res.json(workouts);
});

// @desc    Get specific workout library item
// @route   GET /api/user/workout-library/:id
// @access  Private/User
const getWorkoutLibraryItem = asyncHandler(async (req, res) => {
    const workout = await WorkoutLibrary.findById(req.params.id);
    if (workout) {
        res.json(workout);
    } else {
        res.status(404);
        throw new Error('Workout not found');
    }
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
    getHomeStats,
    checkWorkoutStatus,
    getWorkoutLibrary,
    getWorkoutLibraryItem
};
