const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const MemberAttendance = require('../../models/MemberAttendance');
const Member = require('../../models/Member');

// @desc    Mark attendance via QR
// @route   POST /api/admin/members/attendance/scan
// @access  Private/Admin
const scanQRCode = asyncHandler(async (req, res) => {
    const { memberIdentifier } = req.body; // This could be memberId (e.g. M12345) or _id

    if (!memberIdentifier) {
        res.status(400);
        throw new Error('Member identifier is required');
    }

    // Find member by memberId or _id
    const member = await Member.findOne({
        $or: [
            { memberId: memberIdentifier },
            { _id: mongoose.isValidObjectId(memberIdentifier) ? memberIdentifier : null }
        ].filter(q => q._id !== null || q.memberId)
    });

    if (!member) {
        res.status(404);
        throw new Error('Member not found');
    }

    if (member.status !== 'Active') {
        res.status(400);
        throw new Error(`Member status is ${member.status}. Attendance cannot be marked.`);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if attendance already marked for today
    const existingAttendance = await MemberAttendance.findOne({
        memberId: member._id,
        date: {
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
    });

    if (existingAttendance) {
        // If already checked in, maybe check out?
        if (!existingAttendance.checkOut) {
            existingAttendance.checkOut = new Date();
            await existingAttendance.save();
            return res.status(200).json({
                message: 'Check-out successful',
                attendance: existingAttendance,
                member: {
                    name: `${member.firstName} ${member.lastName}`,
                    memberId: member.memberId
                }
            });
        } else {
            res.status(400);
            throw new Error('Attendance already completed for today');
        }
    }

    // Mark new attendance
    const attendance = await MemberAttendance.create({
        memberId: member._id,
        date: new Date(),
        checkIn: new Date(),
        status: 'Present',
        trainingType: 'General', // Default to general via scan
        method: 'QR'
    });

    res.status(201).json({
        message: 'Check-in successful',
        attendance,
        member: {
            name: `${member.firstName} ${member.lastName}`,
            memberId: member.memberId
        }
    });
});

// @desc    Get all attendance logs
// @route   GET /api/admin/members/attendance
// @access  Private/Admin
const getMemberAttendanceLogs = asyncHandler(async (req, res) => {
    const { startDate, endDate, memberId, trainingType } = req.query;
    let query = {};

    if (memberId) {
        query.memberId = memberId;
    }

    if (trainingType) {
        if (trainingType === 'General') {
            // Include logs that explicitly have 'General' or have NO trainingType (legacy logs)
            query.$or = [
                { trainingType: 'General' },
                { trainingType: { $exists: false } }
            ];
        } else {
            query.trainingType = trainingType;
        }
    }

    if (startDate && endDate) {
        query.date = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        };
    }


    const logs = await MemberAttendance.find(query)
        .populate('memberId', 'firstName lastName memberId mobile')
        .sort({ date: -1 });

    res.json(logs);
});

module.exports = {
    scanQRCode,
    getMemberAttendanceLogs
};
