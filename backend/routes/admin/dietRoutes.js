const express = require('express');
const router = express.Router();
const {
    createDietPlan,
    getDietPlans,
    getMemberDietPlan,
    updateDietPlan,
    deleteDietPlan
} = require('../../controllers/admin/dietController');

router.route('/')
    .post(createDietPlan)
    .get(getDietPlans);

router.get('/member/:memberId', getMemberDietPlan);

router.route('/:id')
    .put(updateDietPlan)
    .delete(deleteDietPlan);

module.exports = router;
