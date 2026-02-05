const WaterIntake = require('../../models/WaterIntake');
const asyncHandler = require('express-async-handler');

// @desc    Get today's water intake
// @route   GET /api/user/water-intake
// @access  Private
const getDailyIntake = asyncHandler(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let intake = await WaterIntake.findOne({
        memberId: req.user._id,
        date: today
    });

    if (!intake) {
        return res.json({
            glasses: 0,
            target: 8
        });
    }

    res.json(intake);
});

// @desc    Update water intake
// @route   POST /api/user/water-intake
// @access  Private
const updateIntake = asyncHandler(async (req, res) => {
    const { glasses } = req.body;
    let { target } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // If target is not provided, try to keep existing or default to 8
    if (!target) {
        target = 8;
    }

    // Upsert
    const intake = await WaterIntake.findOneAndUpdate(
        { memberId: req.user._id, date: today },
        {
            $set: {
                glasses: glasses,
                target: target
            }
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json(intake);
});

module.exports = {
    getDailyIntake,
    updateIntake
};
