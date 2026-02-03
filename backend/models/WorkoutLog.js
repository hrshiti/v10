const mongoose = require('mongoose');

const workoutLogSchema = new mongoose.Schema({
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    workoutId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workout', required: true },
    date: { type: Date, default: Date.now },
    completedExercises: [{ type: String }], // Optional: list of exercise names completed
    status: { type: String, enum: ['Completed', 'Partial'], default: 'Completed' }
}, { timestamps: true });

module.exports = mongoose.model('WorkoutLog', workoutLogSchema);
