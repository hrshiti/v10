const asyncHandler = require('express-async-handler');
const Employee = require('../../models/Employee');
const EmployeeAttendance = require('../../models/EmployeeAttendance');

// @desc    Get currently present trainers
// @route   GET /api/user/trainers/present
// @access  Private/User
const getPresentTrainers = asyncHandler(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Get all attendance records for today where outTime is not set
    const presentAttendance = await EmployeeAttendance.find({
        date: {
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        },
        outTime: { $exists: false } // Still checked in
    }).select('employeeId');

    const employeeIds = presentAttendance.map(a => a.employeeId);

    // 2. Fetch those employees who have "Trainer" in their gymRole
    const presentTrainers = await Employee.find({
        _id: { $in: employeeIds },
        gymRole: 'Trainer', // Mongoose will match if 'Trainer' is in the array
        active: true
    }).select('firstName lastName photo gymActivities experience');

    res.json(presentTrainers);
});

module.exports = {
    getPresentTrainers
};
