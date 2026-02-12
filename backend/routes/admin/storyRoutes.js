const express = require('express');
const router = express.Router();
const { protect } = require('../../middlewares/authMiddleware');
const { getAllStories, deleteStory } = require('../../controllers/admin/storyController');

router.use(protect);

router.get('/all', getAllStories);
router.delete('/:id', deleteStory);

module.exports = router;
