const express = require('express');
const router = express.Router();
const { protect } = require('../../middlewares/authMiddleware');
const upload = require('../../middlewares/uploadMiddleware');
const {
    getWorkoutLibrary,
    createWorkoutLibraryItem,
    updateWorkoutLibraryItem,
    deleteWorkoutLibraryItem
} = require('../../controllers/admin/workoutLibraryController');

router.use(protect);

router.route('/')
    .get(getWorkoutLibrary)
    .post(upload.array('images', 5), createWorkoutLibraryItem);

router.route('/:id')
    .put(upload.array('images', 5), updateWorkoutLibraryItem)
    .delete(deleteWorkoutLibraryItem);

module.exports = router;
