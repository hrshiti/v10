const asyncHandler = require('express-async-handler');
const DietPlan = require('../../models/DietPlan');
const Member = require('../../models/Member');

// @desc    Create a new diet plan
// @route   POST /api/admin/diet-plans
// @access  Private/Admin
const createDietPlan = asyncHandler(async (req, res) => {
    const { name, privacyMode, assignedMembers, trainerId, weeklyPlan } = req.body;

    if (!name || !weeklyPlan) {
        res.status(400);
        throw new Error('Please provide a name and weekly plan');
    }

    const dietPlan = await DietPlan.create({
        name,
        privacyMode,
        assignedMembers,
        trainerId,
        weeklyPlan
    });

    res.status(201).json(dietPlan);
});

// @desc    Get all diet plans
// @route   GET /api/admin/diet-plans
// @access  Private/Admin
const getDietPlans = asyncHandler(async (req, res) => {
    const dietPlans = await DietPlan.find({})
        .populate('trainerId', 'firstName lastName')
        .populate('assignedMembers', 'firstName lastName memberId')
        .sort({ createdAt: -1 });
    res.json(dietPlans);
});

// @desc    Get diet plan for a specific member
// @route   GET /api/admin/diet-plans/member/:memberId
const getMemberDietPlan = asyncHandler(async (req, res) => {
    const dietPlan = await DietPlan.findOne({
        assignedMembers: req.params.memberId,
        status: 'Active'
    }).populate('trainerId', 'firstName lastName');

    if (!dietPlan) {
        res.status(404);
        throw new Error('No active diet plan found for this member');
    }

    res.json(dietPlan);
});

// @desc    Update diet plan
// @route   PUT /api/admin/diet-plans/:id
const updateDietPlan = asyncHandler(async (req, res) => {
    const dietPlan = await DietPlan.findById(req.params.id);

    if (dietPlan) {
        dietPlan.name = req.body.name || dietPlan.name;
        dietPlan.privacyMode = req.body.privacyMode || dietPlan.privacyMode;
        dietPlan.assignedMembers = req.body.assignedMembers || dietPlan.assignedMembers;
        dietPlan.weeklyPlan = req.body.weeklyPlan || dietPlan.weeklyPlan;
        dietPlan.status = req.body.status || dietPlan.status;

        const updatedPlan = await dietPlan.save();
        res.json(updatedPlan);
    } else {
        res.status(404);
        throw new Error('Diet plan not found');
    }
});

// @desc    Delete diet plan
// @route   DELETE /api/admin/diet-plans/:id
const deleteDietPlan = asyncHandler(async (req, res) => {
    const dietPlan = await DietPlan.findById(req.params.id);
    if (dietPlan) {
        await dietPlan.deleteOne();
        res.json({ message: 'Diet plan removed' });
    } else {
        res.status(404);
        throw new Error('Diet plan not found');
    }
});

module.exports = {
    createDietPlan,
    getDietPlans,
    getMemberDietPlan,
    updateDietPlan,
    deleteDietPlan
};
