const mongoose = require('mongoose');
require('dotenv').config();
const Workout = require('./models/Workout');

const workoutData = {
    name: "Weight Gain Level 3 (New)",
    privacyMode: "Public",
    schedule: [
        {
            day: "Monday",
            exercises: [
                { category: "Chest", exercise: "Barbell Bench Press", sets: 3, reps: "15, 12, 10" },
                { category: "Chest", exercise: "Incline Barbell Bench Press", sets: 3, reps: "15, 12, 10" },
                { category: "Chest", exercise: "Dumbbell Press", sets: 3, reps: "15, 12, 10" },
                { category: "Chest", exercise: "Pec Deck Fly", sets: 3, reps: "15, 12, 10" },
                { category: "Chest", exercise: "Chest Press Machine", sets: 3, reps: "15, 12, 10" },
                { category: "Chest", exercise: "Push Up", sets: 3, reps: "15, 12, 10" },
                { category: "Chest", exercise: "Dumbbell Pullover", sets: 3, reps: "15, 12, 10" }
            ]
        },
        {
            day: "Tuesday",
            exercises: [
                { category: "Shoulder", exercise: "Dumbbell One Arm Shoulder Press", sets: 3, reps: "15, 12, 10" },
                { category: "Shoulder", exercise: "Barbell Front Raise", sets: 3, reps: "15, 12, 10" },
                { category: "Shoulder", exercise: "Smith Machine Shoulder Press", sets: 3, reps: "15, 12, 10" },
                { category: "Shoulder", exercise: "Dumbbell Shrug", sets: 3, reps: "15, 12, 10" },
                { category: "Shoulder", exercise: "Barbell Front Raise", sets: 3, reps: "15, 12, 10" },
                { category: "Shoulder", exercise: "Dumbbell Raise", sets: 3, reps: "15, 12, 10" },
                { category: "Shoulder", exercise: "Barbell Upright Row", sets: 3, reps: "15, 12, 10" }
            ]
        },
        {
            day: "Wednesday",
            exercises: [
                { category: "Back", exercise: "Lat Pulldown", sets: 3, reps: "15, 12, 10" },
                { category: "Back", exercise: "Rowing Machine", sets: 3, reps: "15, 12, 10" },
                { category: "Back", exercise: "Lever Cable Rear Pulldown", sets: 3, reps: "15, 12, 10" },
                { category: "Back", exercise: "Dumbbell Row", sets: 3, reps: "15, 12, 10" },
                { category: "Back", exercise: "Incline Barbell Row", sets: 3, reps: "15, 12, 10" },
                { category: "Back", exercise: "T Bar Row", sets: 3, reps: "15, 12, 10" },
                { category: "Back", exercise: "Deadlift", sets: 3, reps: "15, 12, 10" }
            ]
        },
        {
            day: "Thursday",
            exercises: [
                { category: "Biceps", exercise: "Dumbbell Curl", sets: 3, reps: "15, 12, 10" },
                { category: "Biceps", exercise: "Barbell Curl", sets: 3, reps: "15, 12, 10" },
                { category: "Biceps", exercise: "Hammer Curl", sets: 3, reps: "15, 12, 10" },
                { category: "Biceps", exercise: "Overhead Cable Curl", sets: 3, reps: "15, 12, 10" },
                { category: "Biceps", exercise: "Cable Curl", sets: 3, reps: "15, 12, 10" },
                { category: "Biceps", exercise: "Bicep Curl Machine", sets: 3, reps: "15, 12, 10" }
            ]
        },
        {
            day: "Friday",
            exercises: [
                { category: "Triceps", exercise: "Dumbbell Triceps Extension", sets: 3, reps: "15, 12, 10" },
                { category: "Triceps", exercise: "Dumbbell Triceps Extension (Variety)", sets: 3, reps: "15, 12, 10" },
                { category: "Triceps", exercise: "Close Grip Bench Press", sets: 3, reps: "15, 12, 10" },
                { category: "Triceps", exercise: "Pushdown", sets: 3, reps: "15, 12, 10" },
                { category: "Triceps", exercise: "Dumbbell Kickback", sets: 3, reps: "15, 12, 10" },
                { category: "Triceps", exercise: "Diamond Push Up", sets: 3, reps: "15, 12, 10" }
            ]
        },
        {
            day: "Saturday",
            exercises: [
                { category: "Legs", exercise: "Squat", sets: 3, reps: "15, 12, 10" },
                { category: "Legs", exercise: "Leg Press", sets: 3, reps: "15, 12, 10" },
                { category: "Legs", exercise: "Leg Extension", sets: 3, reps: "15, 12, 10" },
                { category: "Legs", exercise: "Leg Curl", sets: 3, reps: "15, 12, 10" },
                { category: "Legs", exercise: "Lunges", sets: 3, reps: "15, 12, 10" },
                { category: "Legs", exercise: "Barbell Sumo Squat", sets: 3, reps: "15, 12, 10" }
            ]
        },
        {
            day: "Sunday",
            exercises: [] // Rest Day
        }
    ]
};

async function seedWorkout() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        const workout = new Workout(workoutData);
        await workout.save();

        console.log("✅ Successfully added Workout: Weight Gain Level 3 (New)");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding workout:", error);
        process.exit(1);
    }
}

seedWorkout();
