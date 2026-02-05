const mongoose = require('mongoose');

const waterIntakeSchema = new mongoose.Schema({
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    glasses: {
        type: Number,
        default: 0
    },
    target: {
        type: Number,
        default: 8
    }
}, { timestamps: true });

// Ensure one entry per member per day
waterIntakeSchema.index({ memberId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('WaterIntake', waterIntakeSchema);
