const asyncHandler = require('express-async-handler');
const EmployeeAttendance = require('../../models/EmployeeAttendance');
const Employee = require('../../models/Employee');

// @desc    Get attendance logs with filters
// @route   GET /api/admin/employees/attendance
const getAttendanceLogs = asyncHandler(async (req, res) => {
    const { fromDate, toDate, employeeId, shift, search } = req.query;
    const pageSize = Number(req.query.pageSize) || Number(req.query.limit) || 10;
    const page = Number(req.query.pageNumber) || Number(req.query.page) || 1;

    const query = {};

    if (fromDate && toDate) {
        query.date = {
            $gte: new Date(fromDate),
            $lte: new Date(toDate)
        };
    }

    if (employeeId) query.employeeId = employeeId;
    if (shift) query.shift = shift;

    // Search by employee name requires population search
    // Using simple find for now
    const count = await EmployeeAttendance.countDocuments(query);
    const logs = await EmployeeAttendance.find(query)
        .populate('employeeId', 'firstName lastName mobile employeeId')
        .sort({ date: -1 })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ logs, page, pages: Math.ceil(count / pageSize), total: count });
});

// @desc    Mark manual attendance
// @route   POST /api/admin/employees/attendance/manual
const markAttendance = asyncHandler(async (req, res) => {
    const { employeeId, date, inTime, outTime, shift } = req.body;

    // Calculate total hours
    let hours = 0;
    if (inTime && outTime) {
        const diff = new Date(outTime) - new Date(inTime);
        hours = Math.round((diff / (1000 * 60 * 60)) * 100) / 100;
    }

    const attendance = await EmployeeAttendance.create({
        employeeId,
        date: date || new Date(),
        inTime,
        outTime,
        totalHours: hours,
        shift
    });

    res.status(201).json(attendance);
});

module.exports = {
    getAttendanceLogs,
    markAttendance
};
