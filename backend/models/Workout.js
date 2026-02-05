const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g. "Weight Loss Phase 1"
    privacyMode: { type: String, enum: ['Public', 'Private'], default: 'Public' },
    assignedMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }, // Ref to staff assigning workout
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    schedule: [
        {
            day: {
                type: String,
                enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                required: true
            },
            exercises: [
                {
                    category: { type: String }, // e.g. "Chest"
                    exercise: { type: String, required: true }, // e.g. "Bench Press"
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
