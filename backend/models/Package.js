const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    // Basic Info
    name: { type: String, required: true },
    type: { type: String, enum: ['general', 'pt'], required: true }, // Plan Type
    activity: { type: String, enum: ['gym', 'yoga', 'zumba', 'crossfit'], required: true },
    timing: { type: String, enum: ['morning', 'evening', 'anytime'], required: true },
    description: { type: String },

    // Core Plan Details
    durationType: { type: String, enum: ['Months', 'Days'], default: 'Months' },
    durationValue: { type: Number, required: true }, // The actual number (e.g. 12 or 365)
    sessions: { type: Number, required: true },
    rackRate: { type: Number, required: true },
    baseRate: { type: Number, required: true }, // The selling price usually

    // Optional / Advanced
    transferDays: { type: Number, default: 0 },
    upgradeDays: { type: Number, default: 0 },
    freezeFrequency: { type: Number, default: 0 },
    freezeDuration: { type: Number, default: 0 },

    // Configuration
    soldLimit: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    sessionDays: [{ type: String }] // e.g. ['Mon', 'Tue', 'Wed'...]
}, { timestamps: true });

module.exports = mongoose.model('Package', packageSchema);
