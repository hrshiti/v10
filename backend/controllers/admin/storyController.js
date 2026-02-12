const asyncHandler = require('express-async-handler');
const SuccessStory = require('../../models/SuccessStory');

// @desc    Get all success stories for admin
// @route   GET /api/admin/stories
// @access  Private/Admin
const getAllStories = asyncHandler(async (req, res) => {
    const stories = await SuccessStory.find({})
        .populate('trainerId', 'firstName lastName photo')
        .sort({ createdAt: -1 });
    res.json(stories);
});

// @desc    Delete a success story by admin
// @route   DELETE /api/admin/story/:id
// @access  Private/Admin
const deleteStory = asyncHandler(async (req, res) => {
    const story = await SuccessStory.findById(req.params.id);
    if (!story) {
        res.status(404);
        throw new Error('Success story not found');
    }

    await story.deleteOne();
    res.json({ message: 'Success story deleted successfully' });
});

module.exports = {
    getAllStories,
    deleteStory
};
