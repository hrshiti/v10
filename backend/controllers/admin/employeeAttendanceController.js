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
        const start = new Date(fromDate);
        start.setHours(0, 0, 0, 0);

        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);

        query.date = {
            $gte: start,
            $lte: end
        };
    } else if (fromDate) {
        const start = new Date(fromDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(fromDate);
        end.setHours(23, 59, 59, 999);
        query.date = { $gte: start, $lte: end };
    }

    if (employeeId) query.employeeId = employeeId;
    if (shift) query.shift = shift;

    if (search) {
        const matchingEmployees = await Employee.find({
            $or: [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { mobile: { $regex: search, $options: 'i' } },
                { employeeId: { $regex: search, $options: 'i' } }
            ]
        }).select('_id');
        query.employeeId = { $in: matchingEmployees.map(e => e._id) };
    }
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

    const targetDate = new Date(date || new Date());
    targetDate.setHours(0, 0, 0, 0);

    // Calculate total hours
    let hours = 0;
    if (inTime && outTime) {
        const diff = new Date(outTime) - new Date(inTime);
        hours = Math.round((diff / (1000 * 60 * 60)) * 100) / 100;
    }

    // Upsert logic: Find existing for that day, or create new
    const attendance = await EmployeeAttendance.findOneAndUpdate(
        {
            employeeId,
            date: {
                $gte: targetDate,
                $lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000)
            }
        },
        {
            employeeId,
            date: targetDate,
            inTime: inTime ? new Date(inTime) : undefined,
            outTime: outTime ? new Date(outTime) : undefined,
            totalHours: hours,
            shift
        },
        { new: true, upsert: true }
    );

    res.status(201).json(attendance);
});


// @desc    Punch In (Start of shift)
// @route   POST /api/admin/employees/attendance/punch-in
const punchIn = asyncHandler(async (req, res) => {
    const { employeeId, shift } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already punched in for today
    const existing = await EmployeeAttendance.findOne({
        employeeId,
        date: {
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        },
        outTime: { $exists: false }
    });

    if (existing) {
        res.status(400);
        throw new Error('Employee already punched in today.');
    }

    const attendance = await EmployeeAttendance.create({
        employeeId,
        date: new Date(),
        inTime: new Date(),
        shift
    });

    res.status(201).json(attendance);
});

// @desc    Punch Out (End of shift)
// @route   POST /api/admin/employees/attendance/punch-out
const punchOut = asyncHandler(async (req, res) => {
    const { employeeId } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await EmployeeAttendance.findOne({
        employeeId,
        date: {
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        },
        outTime: { $exists: false }
    });

    if (!attendance) {
        res.status(404);
        throw new Error('No active punch-in found for today.');
    }

    attendance.outTime = new Date();

    // Calculate total hours only if inTime exists
    if (attendance.inTime) {
        const diff = attendance.outTime - attendance.inTime;
        attendance.totalHours = Math.round((diff / (1000 * 60 * 60)) * 100) / 100;
    } else {
        attendance.totalHours = 0;
    }

    await attendance.save();
    res.json(attendance);
});

module.exports = {
    getAttendanceLogs,
    markAttendance,
    punchIn,
    punchOut
};

