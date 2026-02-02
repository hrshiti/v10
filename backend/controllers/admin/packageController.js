const asyncHandler = require('express-async-handler');
const Package = require('../../models/Package');

// @desc    Get all packages (active)
// @route   GET /api/admin/packages
// @access  Public/Admin
const getPackages = asyncHandler(async (req, res) => {
    const packages = await Package.find({ active: true }).sort({ createdAt: -1 });
    res.json(packages);
});

// @desc    Create a package
// @route   POST /api/admin/packages
// @access  Private/Admin
const createPackage = asyncHandler(async (req, res) => {
    // We can just dump the body since schema handles validation
    // But destructing often safer to avoid unwanted fields
    const {
        name, type, activity, timing, description,
        durationType, durationValue, sessions, rackRate, baseRate,
        transferDays, upgradeDays, freezeFrequency, freezeDuration,
        soldLimit, sessionDays
    } = req.body;

    const pkg = await Package.create({
        name, type, activity, timing, description,
        durationType, durationValue, sessions, rackRate, baseRate,
        transferDays, upgradeDays, freezeFrequency, freezeDuration,
        soldLimit, sessionDays
    });

    res.status(201).json(pkg);
});

// @desc    Update Package
// @route   PUT /api/admin/packages/:id
const updatePackage = asyncHandler(async (req, res) => {
    const pkg = await Package.findById(req.params.id);
    if (pkg) {
        pkg.name = req.body.name || pkg.name;
        pkg.price = req.body.price || pkg.price;
        // ... other fields
        const updated = await pkg.save();
        res.json(updated);
    } else {
        res.status(404);
        throw new Error('Package not found');
    }
});

// @desc    Delete Package (Soft delete preferred)
// @route   DELETE /api/admin/packages/:id
const deletePackage = asyncHandler(async (req, res) => {
    const pkg = await Package.findById(req.params.id);
    if (pkg) {
        pkg.active = false; // Soft delete
        await pkg.save();
        res.json({ message: 'Package deactivated' });
    } else {
        res.status(404);
        throw new Error('Package not found');
    }
});

module.exports = { getPackages, createPackage, updatePackage, deletePackage };
