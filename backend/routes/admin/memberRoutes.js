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
    createFreshSale,
    extendMembership,
    changeStartDate,
    getMemberSubscriptions,
    freezeMembership,
    upgradeMembership,
    transferMembership,
    bulkDeactivateMembers,
    bulkAssignTrainer
} = require('../../controllers/admin/memberController');

const {
    scanQRCode,
    getMemberAttendanceLogs
} = require('../../controllers/admin/memberAttendanceController');

// Attendance
router.post('/attendance/scan', scanQRCode);
router.get('/attendance', getMemberAttendanceLogs);

router.post('/renew', renewMembership);
router.post('/sale', createFreshSale);
router.put('/bulk-deactivate', bulkDeactivateMembers);
router.put('/bulk-assign-trainer', bulkAssignTrainer);
router.put('/:id/extend', extendMembership);
router.put('/:id/change-start-date', changeStartDate);
router.post('/:id/freeze', freezeMembership);
router.post('/:id/upgrade', upgradeMembership);
router.post('/:id/transfer', transferMembership);

router.route('/')
    .get(getMembers)
    .post(createMember);

router.get('/stats', getMemberStats);

router.route('/:id')
    .get(getMemberById)
    .put(updateMember)
    .delete(deleteMember);

// Subscriptions
router.get('/:id/subscriptions', getMemberSubscriptions);

// Document routes - must be imported first
const { uploadDocument } = require('../../config/cloudinaryDocuments');
const {
    uploadMemberDocument,
    deleteMemberDocument,
    getMemberDocuments
} = require('../../controllers/admin/memberDocumentController');

// Document upload routes
router.post('/:id/documents', uploadDocument.array('documents', 5), uploadMemberDocument);
router.get('/:id/documents', getMemberDocuments);
router.delete('/:id/documents/:documentId', deleteMemberDocument);

module.exports = router;
