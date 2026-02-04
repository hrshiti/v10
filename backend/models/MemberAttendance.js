const mongoose = require('mongoose');

const memberAttendanceSchema = new mongoose.Schema({
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    date: { type: Date, required: true, default: Date.now },
    checkIn: { type: Date, default: Date.now },
    checkOut: { type: Date },
    status: { type: String, enum: ['Present', 'Absent'], default: 'Present' },
    trainingType: { type: String, enum: ['General', 'Personal'], default: 'General' },
    method: { type: String, enum: ['QR', 'Manual'], default: 'QR' }
}, { timestamps: true });

// Ensure only one attendance record per member per day
// memberAttendanceSchema.index({ memberId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('MemberAttendance', memberAttendanceSchema);
