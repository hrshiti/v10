const mongoose = require('mongoose');

const employeeAttendanceSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    date: { type: Date, required: true },
    inTime: { type: Date },
    outTime: { type: Date },
    totalHours: { type: Number }, // in hours (decimal)
    shift: { type: String, enum: ['Full Time', 'Shift Time'] },
    status: { type: String, enum: ['Present', 'Absent', 'Half Day'], default: 'Present' }
}, { timestamps: true });

module.exports = mongoose.model('EmployeeAttendance', employeeAttendanceSchema);
