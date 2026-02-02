const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }, // Ref to staff assigning workout
    name: { type: String, required: true }, // e.g. "Weight Loss Phase 1"
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    schedule: [
        {
            day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
            workoutType: { type: String }, // e.g. "Chest & Triceps"
            exercises: [
                {
                    name: { type: String },
                    sets: { type: Number },
                    reps: { type: String }, // "12-15"
                    weight: { type: String }, // "10kg"
                    remark: { type: String }
                }
            ]
        }
    ],
    status: { type: String, enum: ['Active', 'Completed', 'Archived'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);
