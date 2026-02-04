const express = require('express');
const router = express.Router();
const {
    getFollowUps,
    createFollowUp,
    markFollowUpDone,
    deleteFollowUp,
    updateFollowUp
} = require('../../controllers/admin/followUpController');
const { protect } = require('../../middlewares/authMiddleware');

router.use(protect);

router.route('/')
    .get(getFollowUps)
    .post(createFollowUp);

router.route('/:id/done')
    .put(markFollowUpDone);

router.route('/:id')
    .put(updateFollowUp)
    .delete(deleteFollowUp);

module.exports = router;
