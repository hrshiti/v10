const asyncHandler = require('express-async-handler');
const HealthAssessment = require('../../models/HealthAssessment');
const Member = require('../../models/Member');

// @desc    Get all health assessments
// @route   GET /api/admin/reports/health-assessments
// @access  Private/Admin
const getHealthAssessments = asyncHandler(async (req, res) => {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;
    const search = req.query.search || '';

    let query = {};

    if (search) {
        const members = await Member.find({
            $or: [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { mobile: { $regex: search, $options: 'i' } }
            ]
        }).select('_id');

        query.memberId = { $in: members.map(m => m._id) };
    }

    const count = await HealthAssessment.countDocuments(query);
    const assessments = await HealthAssessment.find(query)
        .populate('memberId', 'firstName lastName mobile')
        .sort({ date: -1 })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({
        assessments: assessments.map(a => ({
            _id: a._id,
            member: `${a.memberId?.firstName} ${a.memberId?.lastName}`,
            date: a.date,
            number: a.memberId?.mobile,
            memberId: a.memberId?._id
        })),
        page,
        pages: Math.ceil(count / pageSize),
        total: count
    });
});

// @desc    Create new health assessment
// @route   POST /api/admin/reports/health-assessments
// @access  Private/Admin
const createHealthAssessment = asyncHandler(async (req, res) => {
    const {
        memberId, date, age, skeletalMuscles, height, weight, bodyFat, visceralFat, bmi,
        thigh, shoulder, biceps, calf, forearm, chest, glutes, waist, neck, back
    } = req.body;

    const assessment = await HealthAssessment.create({
        memberId,
        date,
        age,
        skeletalMuscles,
        height,
        weight,
        bodyFat,
        visceralFat,
        bmi,
        thigh,
        shoulder,
        biceps,
        calf,
        forearm,
        chest,
        glutes,
        waist,
        neck,
        back,
        createdBy: req.admin._id
    });

    res.status(201).json(assessment);
});

module.exports = {
    getHealthAssessments,
    createHealthAssessment
};
