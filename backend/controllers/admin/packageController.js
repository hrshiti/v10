const asyncHandler = require('express-async-handler');
const Package = require('../../models/Package');

// @desc    Get all packages (active)
// @route   GET /api/admin/packages
// @access  Public/Admin
const getPackages = asyncHandler(async (req, res) => {
    const packages = await Package.find({ isDeleted: false }).sort({ createdAt: -1 });
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
        // Update all fields if provided
        pkg.name = req.body.name || pkg.name;
        pkg.type = req.body.type || pkg.type;
        pkg.activity = req.body.activity || pkg.activity;
        pkg.timing = req.body.timing || pkg.timing;
        pkg.description = req.body.description !== undefined ? req.body.description : pkg.description;
        pkg.durationType = req.body.durationType || pkg.durationType;
        pkg.durationValue = req.body.durationValue || pkg.durationValue;
        pkg.sessions = req.body.sessions || pkg.sessions;
        pkg.rackRate = req.body.rackRate || pkg.rackRate;
        pkg.baseRate = req.body.baseRate || pkg.baseRate;
        pkg.transferDays = req.body.transferDays !== undefined ? req.body.transferDays : pkg.transferDays;
        pkg.upgradeDays = req.body.upgradeDays !== undefined ? req.body.upgradeDays : pkg.upgradeDays;
        pkg.freezeFrequency = req.body.freezeFrequency !== undefined ? req.body.freezeFrequency : pkg.freezeFrequency;
        pkg.freezeDuration = req.body.freezeDuration !== undefined ? req.body.freezeDuration : pkg.freezeDuration;
        pkg.soldLimit = req.body.soldLimit !== undefined ? req.body.soldLimit : pkg.soldLimit;
        pkg.active = req.body.active !== undefined ? req.body.active : pkg.active;
        pkg.sessionDays = req.body.sessionDays || pkg.sessionDays;

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
        pkg.isDeleted = true; // Soft delete distinct from inactive
        await pkg.save();
        res.json({ message: 'Package deleted' });
    } else {
        res.status(404);
        throw new Error('Package not found');
    }
});

module.exports = { getPackages, createPackage, updatePackage, deletePackage };
