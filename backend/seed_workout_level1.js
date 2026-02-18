const mongoose = require('mongoose');
require('dotenv').config();
const Workout = require('./models/Workout');

const workoutData = {
    name: "Weight Gain Level 1 (New)",
    privacyMode: "Public",
    schedule: [
        {
            day: "Monday",
            exercises: [
                { category: "Cardio", exercise: "Treadmill", sets: 1, reps: "10 Minutes" },
                { category: "Cardio", exercise: "Cross Body Push-Up", sets: 3, reps: "3" },
                { category: "Chest", exercise: "Barbell Bench Press", sets: 3, reps: "15, 12, 10" },
                { category: "Chest", exercise: "Incline Barbell Bench Press", sets: 3, reps: "15, 12, 10" },
                { category: "Chest", exercise: "Dumbbell Press", sets: 3, reps: "15, 12, 10" },
                { category: "Chest", exercise: "Pec Deck Fly", sets: 3, reps: "15, 12, 10" }
            ]
        },
        {
            day: "Tuesday",
            exercises: [
                { category: "Cardio", exercise: "Treadmill", sets: 1, reps: "10 Minutes" },
                { category: "Shoulder", exercise: "Dumbbell Shoulder Press", sets: 3, reps: "15, 12, 10" },
                { category: "Shoulder", exercise: "Barbell Front Raise", sets: 3, reps: "15, 12, 10" },
                { category: "Shoulder", exercise: "Smith Machine Shoulder Press", sets: 3, reps: "15, 12, 10" },
                { category: "Shoulder", exercise: "Dumbbell Shrug", sets: 3, reps: "15, 12, 10" }
            ]
        },
        {
            day: "Wednesday",
            exercises: [
                { category: "Cardio", exercise: "Treadmill", sets: 1, reps: "10 Minutes" },
                { category: "Back", exercise: "Lat Pulldown", sets: 3, reps: "15, 12, 10" },
                { category: "Back", exercise: "Rowing Machine", sets: 3, reps: "15, 12, 10" },
                { category: "Back", exercise: "V Bar Lat Pulldown", sets: 3, reps: "15, 12, 10" },
                { category: "Shoulder", exercise: "Barbell Shrug", sets: 3, reps: "15, 12, 10" }
            ]
        },
        {
            day: "Thursday",
            exercises: [
                { category: "Cardio", exercise: "Treadmill", sets: 1, reps: "10 Minutes" },
                { category: "Biceps", exercise: "Dumbbell Curl", sets: 3, reps: "15, 12, 10" },
                { category: "Biceps", exercise: "Barbell Curl", sets: 3, reps: "15, 12, 10" },
                { category: "Biceps", exercise: "Dumbbell Preacher Curl", sets: 3, reps: "15, 12, 10" },
                { category: "Biceps", exercise: "Hammer Curl", sets: 3, reps: "15, 12, 10" }
            ]
        },
        {
            day: "Friday",
            exercises: [
                { category: "Cardio", exercise: "Treadmill", sets: 1, reps: "10 Minutes" },
                { category: "Triceps", exercise: "Barbell Triceps Extension", sets: 3, reps: "15, 12, 10" },
                { category: "Triceps", exercise: "Seated One-Arm Dumbbell Triceps Extension", sets: 3, reps: "15, 12, 10" },
                { category: "Triceps", exercise: "EZ Bar Lying Close Grip Triceps Extension Behind Head", sets: 3, reps: "15, 12, 10" },
                { category: "Triceps", exercise: "Pushdown", sets: 3, reps: "15, 12, 10" }
            ]
        },
        {
            day: "Saturday",
            exercises: [
                { category: "Cardio", exercise: "Treadmill", sets: 1, reps: "10 Minutes" },
                { category: "Legs", exercise: "Squat", sets: 3, reps: "15, 12, 10" },
                { category: "Legs", exercise: "Leg Press", sets: 3, reps: "15, 12, 10" },
                { category: "Legs", exercise: "Leg Extension", sets: 3, reps: "15, 12, 10" },
                { category: "Legs", exercise: "Leg Curl", sets: 3, reps: "15, 12, 10" }
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

        console.log("✅ Successfully added Workout: Weight Gain Level 1 (New)");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding workout:", error);
        process.exit(1);
    }
}

seedWorkout();
