const asyncHandler = require('express-async-handler');
const GymDetail = require('../../models/GymDetail');

// @desc    Get gym details
// @route   GET /api/admin/gym-details
// @access  Private/Admin
const getGymDetails = asyncHandler(async (req, res) => {
    let gymDetail = await GymDetail.findOne();
    if (!gymDetail) {
        // Create initial entry if it doesn't exist
        gymDetail = await GymDetail.create({
            name: 'V-10 Fitness',
            contactNumber: '8347008511',
            address: '1st Floor, Rajshree Skyz',
            gstNo: ''
        });
    }
    res.json(gymDetail);
});

// @desc    Update gym details
// @route   PUT /api/admin/gym-details
// @access  Private/Admin
const updateGymDetails = asyncHandler(async (req, res) => {
    const { name, contactNumber, address, gstNo } = req.body;
    let gymDetail = await GymDetail.findOne();

    if (gymDetail) {
        gymDetail.name = name || gymDetail.name;
        gymDetail.contactNumber = contactNumber || gymDetail.contactNumber;
        gymDetail.address = address || gymDetail.address;
        gymDetail.gstNo = gstNo !== undefined ? gstNo : gymDetail.gstNo;

        if (req.file) {
            gymDetail.logo = req.file.path;
        }

        const updatedGym = await gymDetail.save();
        res.json(updatedGym);
    } else {
        const newGym = await GymDetail.create({
            name,
            contactNumber,
            address,
            gstNo,
            logo: req.file ? req.file.path : null
        });
        res.json(newGym);
    }
});

module.exports = {
    getGymDetails,
    updateGymDetails
};
