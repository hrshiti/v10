const mongoose = require('mongoose');

const healthAssessmentSchema = new mongoose.Schema({
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    date: { type: Date, required: true, default: Date.now },
    age: { type: Number },
    skeletalMuscles: { type: Number },
    height: { type: Number },
    weight: { type: Number },
    bodyFat: { type: Number },
    visceralFat: { type: Number },
    bmi: { type: Number },

    // Measurements
    thigh: {
        left: { type: Number },
        right: { type: Number }
    },
    shoulder: { type: Number },
    biceps: {
        left: { type: Number },
        right: { type: Number }
    },
    calf: {
        left: { type: Number },
        right: { type: Number }
    },
    forearm: {
        left: { type: Number },
        right: { type: Number }
    },
    chest: { type: Number },
    glutes: { type: Number },
    waist: { type: Number },
    neck: { type: Number },
    back: { type: Number },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
}, { timestamps: true });

module.exports = mongoose.model('HealthAssessment', healthAssessmentSchema);
