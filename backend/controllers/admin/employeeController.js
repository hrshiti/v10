const asyncHandler = require('express-async-handler');
const Employee = require('../../models/Employee');

// @desc    Get all employees with pagination and search
// @route   GET /api/admin/employees
// @access  Private/Admin
const getEmployees = asyncHandler(async (req, res) => {
    const pageSize = Number(req.query.pageSize) || Number(req.query.limit) || 10;
    const page = Number(req.query.pageNumber) || Number(req.query.page) || 1;

    const keyword = req.query.keyword
        ? {
            $or: [
                { firstName: { $regex: req.query.keyword, $options: 'i' } },
                { lastName: { $regex: req.query.keyword, $options: 'i' } },
                { mobile: { $regex: req.query.keyword, $options: 'i' } },
                { employeeId: { $regex: req.query.keyword, $options: 'i' } },
            ],
        }
        : {};

    const count = await Employee.countDocuments({ ...keyword });
    const employees = await Employee.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort({ createdAt: -1 });

    res.json({ employees, page, pages: Math.ceil(count / pageSize), total: count });
});

// @desc    Get employees by role (e.g. Trainers)
// @route   GET /api/admin/employees/role/:role
const getEmployeesByRole = asyncHandler(async (req, res) => {
    const employees = await Employee.find({
        gymRole: { $in: [req.params.role] },
        active: true
    }).select('firstName lastName employeeId');
    res.json(employees);
});

// @desc    Create an employee
// @route   POST /api/admin/employees
// @access  Private/Admin
const createEmployee = asyncHandler(async (req, res) => {
    const {
        firstName, lastName, mobile, email, gender, maritalStatus,
        birthDate, anniversaryDate, language, gymRole,
        gymActivities, address, country, state, city, employeeType
    } = req.body;

    const employeeExists = await Employee.findOne({ mobile });
    if (employeeExists) {
        res.status(400);
        throw new Error('Employee already exists with this mobile number');
    }

    const employee = await Employee.create({
        firstName, lastName, mobile, email, gender, maritalStatus,
        birthDate, anniversaryDate, language, gymRole,
        gymActivities, address, country, state, city, employeeType
    });

    if (employee) {
        res.status(201).json(employee);
    } else {
        res.status(400);
        throw new Error('Invalid employee data');
    }
});

// @desc    Update employee
// @route   PUT /api/admin/employees/:id
// @access  Private/Admin
const updateEmployee = asyncHandler(async (req, res) => {
    const employee = await Employee.findById(req.params.id);

    if (employee) {
        employee.firstName = req.body.firstName || employee.firstName;
        employee.lastName = req.body.lastName || employee.lastName;
        employee.mobile = req.body.mobile || employee.mobile;
        employee.email = req.body.email || employee.email;
        employee.gender = req.body.gender || employee.gender;
        employee.maritalStatus = req.body.maritalStatus || employee.maritalStatus;
        employee.birthDate = req.body.birthDate || employee.birthDate;
        employee.anniversaryDate = req.body.anniversaryDate === null ? null : (req.body.anniversaryDate || employee.anniversaryDate);
        employee.language = req.body.language || employee.language;
        employee.gymRole = req.body.gymRole || employee.gymRole;
        employee.gymActivities = req.body.gymActivities || employee.gymActivities;
        employee.address = req.body.address || employee.address;
        employee.country = req.body.country || employee.country;
        employee.state = req.body.state || employee.state;
        employee.city = req.body.city || employee.city;
        employee.employeeType = req.body.employeeType || employee.employeeType;
        employee.active = req.body.active !== undefined ? req.body.active : employee.active;

        const updatedEmployee = await employee.save();
        res.json(updatedEmployee);
    } else {
        res.status(404);
        throw new Error('Employee not found');
    }
});

// @desc    Toggle employee status
// @route   PATCH /api/admin/employees/:id/toggle
const toggleEmployeeStatus = asyncHandler(async (req, res) => {
    const employee = await Employee.findById(req.params.id);
    if (employee) {
        employee.active = !employee.active;
        await employee.save();
        res.json({ message: 'Status updated', active: employee.active });
    } else {
        res.status(404);
        throw new Error('Employee not found');
    }
});

// @desc    Delete employee
// @route   DELETE /api/admin/employees/:id
// @access  Private/Admin
const deleteEmployee = asyncHandler(async (req, res) => {
    const employee = await Employee.findById(req.params.id);
    if (employee) {
        await employee.deleteOne();
        res.json({ message: 'Employee removed' });
    } else {
        res.status(404);
        throw new Error('Employee not found');
    }
});

module.exports = {
    getEmployees,
    getEmployeesByRole,
    createEmployee,
    updateEmployee,
    toggleEmployeeStatus,
    deleteEmployee
};
