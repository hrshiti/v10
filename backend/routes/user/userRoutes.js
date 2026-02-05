const express = require('express');
const router = express.Router();
const { userProtect } = require('../../middlewares/authMiddleware');
const {
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
    checkWorkoutStatus
} = require('../../controllers/user/userController');

const upload = require('../../middlewares/uploadMiddleware');

// All user routes are protected
router.use(userProtect);

router.get('/profile', getUserProfile);
router.put('/profile', upload.single('photo'), updateUserProfile);
router.post('/attendance/scan', userScanQR);
router.get('/attendance', getUserAttendance);
router.get('/diet-plan', getUserDietPlan);
router.get('/workouts', getUserWorkouts);
router.post('/workouts/log', logWorkoutCompletion);
router.get('/workouts/status', checkWorkoutStatus);
router.get('/workouts/stats', getWorkoutStats);
router.route('/feedback')
    .get(getUserFeedbacks)
    .post(submitFeedback);
router.get('/stats', getHomeStats);

module.exports = router;
