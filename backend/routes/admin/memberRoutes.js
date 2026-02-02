const express = require('express');
const router = express.Router();
const {
    getMembers,
    getMemberById,
    createMember,
    updateMember,
    deleteMember,
    getMemberStats,
    renewMembership,
    extendMembership,
    changeStartDate
} = require('../../controllers/admin/memberController');

router.post('/renew', renewMembership);
router.put('/:id/extend', extendMembership);
router.put('/:id/change-start-date', changeStartDate);

router.route('/')
    .get(getMembers)
    .post(createMember);

router.get('/stats', getMemberStats);

router.route('/:id')
    .get(getMemberById)
    .put(updateMember)
    .delete(deleteMember);

module.exports = router;
