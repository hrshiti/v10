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
    try {
        console.log('--- Gym Update Request ---');
        console.log('Body:', req.body);
        console.log('File:', req.file ? req.file.path : 'No file');

        const { name, contactNumber, address, gstNo } = req.body;
        let gymDetail = await GymDetail.findOne();

        if (gymDetail) {
            console.log('Updating existing gym record:', gymDetail._id);
            gymDetail.name = name || gymDetail.name;
            gymDetail.contactNumber = contactNumber || gymDetail.contactNumber;
            gymDetail.address = address || gymDetail.address;
            gymDetail.gstNo = gstNo !== undefined ? gstNo : gymDetail.gstNo;

            if (req.file) {
                gymDetail.logo = req.file.path;
            }

            const updatedGym = await gymDetail.save();
            console.log('✅ Gym details updated successfully');
            res.json(updatedGym);
        } else {
            console.log('Creating new gym record');
            const newGym = await GymDetail.create({
                name,
                contactNumber,
                address,
                gstNo,
                logo: req.file ? req.file.path : null
            });
            console.log('✅ New gym record created');
            res.json(newGym);
        }
    } catch (error) {
        console.error('❌ ERROR in updateGymDetails:', error);
        res.status(500);
        throw new Error(error.message || 'Error updating gym details');
    }
});

module.exports = {
    getGymDetails,
    updateGymDetails
};
