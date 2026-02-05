const mongoose = require('mongoose');

const workoutLogSchema = new mongoose.Schema({
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    workoutId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workout', required: true },
    date: { type: Date, default: Date.now },
    completedExercises: [{ type: String }], // IDs or Names of completed exercises
    totalExercises: { type: Number, default: 0 },
    status: { type: String, enum: ['Completed', 'Partial'], default: 'Completed' },
    day: { type: String } // 'Monday', 'Tuesday', etc.
}, { timestamps: true });

module.exports = mongoose.model('WorkoutLog', workoutLogSchema);
