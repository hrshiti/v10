const express = require('express');
const router = express.Router();
const {
    getEmployees,
    getEmployeesByRole,
    createEmployee,
    updateEmployee,
    toggleEmployeeStatus,
    deleteEmployee
} = require('../../controllers/admin/employeeController');
const {
    getAttendanceLogs,
    markAttendance
} = require('../../controllers/admin/employeeAttendanceController');

const upload = require('../../middlewares/uploadMiddleware');

router.route('/')
    .get(getEmployees)
    .post(upload.single('photo'), createEmployee);

router.get('/role/:role', getEmployeesByRole);

// Attendance
router.get('/attendance', getAttendanceLogs);
router.post('/attendance/manual', markAttendance);

router.route('/:id')
    .put(upload.single('photo'), updateEmployee)
    .delete(deleteEmployee);

router.patch('/:id/toggle', toggleEmployeeStatus);

module.exports = router;
