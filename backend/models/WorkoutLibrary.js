const mongoose = require('mongoose');

const workoutLibrarySchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true }, // e.g. "HIIT", "Yoga", "Strength"
    intensity: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    duration: { type: String }, // e.g. "45 Mins"
    sets: { type: String }, // e.g. "3 Sets"
    reps: { type: String }, // e.g. "12 Reps" or "30s each"
    calories: { type: Number }, // e.g. 300
    description: { type: String },
    images: [{ type: String }], // Array of image URLs/paths
    tags: [{ type: String }], // e.g. ["No Equipment", "Full Body"]
    active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('WorkoutLibrary', workoutLibrarySchema);
