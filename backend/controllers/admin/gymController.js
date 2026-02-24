const asyncHandler = require('express-async-handler');
const GymDetail = require('../../models/GymDetail');
const crypto = require('crypto');

// @desc    Get gym details
// @route   GET /api/admin/gym-details
// @access  Private/Admin
const getGymDetails = asyncHandler(async (req, res) => {
    let gymDetail = await GymDetail.findOne();
    if (!gymDetail) {
        // Create initial entry if it doesn't exist (gymCode will auto-generate via schema default)
        gymDetail = await GymDetail.create({
            name: 'V-10 Fitness',
            contactNumber: '8347008511',
            address: '1st Floor, Rajshree Skyz',
            gstNo: ''
        });
    }

    // If existing record somehow has no gymCode, generate and save one
    if (!gymDetail.gymCode) {
        gymDetail.gymCode = `V10GYM_${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
        await gymDetail.save();
    }

    res.json(gymDetail);
});

// @desc    Get gym QR code data (the secret code to be encoded in the gym's QR)
// @route   GET /api/admin/gym-details/qr-code
// @access  Private/Admin
const getGymQRCode = asyncHandler(async (req, res) => {
    let gymDetail = await GymDetail.findOne();
    if (!gymDetail) {
        gymDetail = await GymDetail.create({
            name: 'V-10 Fitness',
            contactNumber: '8347008511',
            address: '1st Floor, Rajshree Skyz',
            gstNo: ''
        });
    }

    if (!gymDetail.gymCode) {
        gymDetail.gymCode = `V10GYM_${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
        await gymDetail.save();
    }

    res.json({ gymCode: gymDetail.gymCode, gymName: gymDetail.name });
});

// @desc    Regenerate gym QR code (invalidates the old one)
// @route   POST /api/admin/gym-details/qr-code/regenerate
// @access  Private/Admin
const regenerateGymQRCode = asyncHandler(async (req, res) => {
    let gymDetail = await GymDetail.findOne();
    if (!gymDetail) {
        gymDetail = await GymDetail.create({ name: 'V-10 Fitness' });
    }

    gymDetail.gymCode = `V10GYM_${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
    await gymDetail.save();

    res.json({ gymCode: gymDetail.gymCode, gymName: gymDetail.name, message: 'QR Code regenerated successfully' });
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
    getGymQRCode,
    regenerateGymQRCode,
    updateGymDetails
};
