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
    checkWorkoutStatus,
    getWorkoutLibrary,
    getWorkoutLibraryItem
} = require('../../controllers/user/userController');
const {
    getPresentTrainers,
    trainerScanQR,
    createSuccessStory,
    getSuccessStories,
    getTrainerStories,
    getTrainerStats,
    updateSuccessStory,
    deleteSuccessStory,
    updateTrainerProfile
} = require('../../controllers/user/trainerController');

const upload = require('../../middlewares/uploadMiddleware');

// All user routes are protected
router.use(userProtect);

router.get('/trainers/present', getPresentTrainers);
router.get('/profile', getUserProfile);

router.put('/profile', upload.single('photo'), updateUserProfile);
router.post('/attendance/scan', userScanQR);
router.get('/attendance', getUserAttendance);
router.get('/diet-plan', getUserDietPlan);
router.get('/workouts', getUserWorkouts);
router.post('/workouts/log', logWorkoutCompletion);
router.get('/workouts/status', checkWorkoutStatus);
router.get('/workouts/stats', getWorkoutStats);
router.get('/workout-library', getWorkoutLibrary);
router.get('/workout-library/:id', getWorkoutLibraryItem);
router.route('/feedback')
    .get(getUserFeedbacks)
    .post(submitFeedback);
router.get('/stats', getHomeStats);

// Trainer Routes
router.post('/trainer/scan', trainerScanQR);
router.route('/trainer/story')
    .post(upload.fields([{ name: 'beforeImage', maxCount: 1 }, { name: 'afterImage', maxCount: 1 }]), createSuccessStory);

router.route('/trainer/story/:id')
    .put(upload.fields([{ name: 'beforeImage', maxCount: 1 }, { name: 'afterImage', maxCount: 1 }]), updateSuccessStory)
    .delete(deleteSuccessStory);

router.get('/trainer/stories', getSuccessStories);     // For users to view
router.get('/trainer/my-stories', getTrainerStories);  // For trainer to view own
router.get('/trainer/stats', getTrainerStats);
router.put('/trainer/profile', upload.single('photo'), updateTrainerProfile);

module.exports = router;
