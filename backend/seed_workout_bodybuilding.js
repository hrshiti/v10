const mongoose = require('mongoose');
require('dotenv').config();
const Workout = require('./models/Workout');

const workoutData = {
    name: "Body Building",
    privacyMode: "Public",
    schedule: [
        {
            day: "Monday",
            exercises: [
                { category: "Chest", exercise: "Barbell Bench Press", sets: 3, reps: "15, 12, 10" },
                { category: "Chest", exercise: "Incline Barbell Bench Press", sets: 3, reps: "15, 12, 10" },
                { category: "Chest", exercise: "Chest Press Machine", sets: 3, reps: "15, 12, 10" },
                { category: "Chest", exercise: "Chest Dips", sets: 3, reps: "15, 12, 10" },
                { category: "Chest", exercise: "Pec Deck Fly", sets: 3, reps: "15, 12, 10" },
                { category: "Chest", exercise: "Dumbbell Pullover", sets: 3, reps: "15, 12, 10" },
                { category: "Triceps", exercise: "Pushdown", sets: 3, reps: "15, 12, 10" }
            ]
        },
        {
            day: "Tuesday",
            exercises: [
                { category: "Back", exercise: "Chin Up", sets: 3, reps: "15, 12, 10" },
                { category: "Back", exercise: "Lat Pulldown", sets: 3, reps: "15, 12, 10" },
                { category: "Back", exercise: "One Arm Cable Row", sets: 3, reps: "15, 12, 10" },
                { category: "Back", exercise: "Reverse Lat Pulldown", sets: 3, reps: "15, 12, 10" },
                { category: "Back", exercise: "Seated Cable Row", sets: 3, reps: "15, 12, 10" }
            ]
        },
        {
            day: "Wednesday",
            exercises: [
                { category: "Leg", exercise: "Squat", sets: 3, reps: "15, 12, 10" },
                { category: "Leg", exercise: "Lunges", sets: 3, reps: "15, 12, 10" },
                { category: "Leg", exercise: "Leg Extension", sets: 3, reps: "15, 12, 10" },
                { category: "Leg", exercise: "Leg Press", sets: 3, reps: "15, 12, 10" },
                { category: "Leg", exercise: "Leg Curl", sets: 3, reps: "15, 12, 10" },
                { category: "Leg", exercise: "Lever Standing Leg Raise", sets: 3, reps: "15, 12, 10" }
            ]
        },
        {
            day: "Thursday",
            exercises: [
                { category: "Shoulder", exercise: "Dumbbell Shoulder Press", sets: 3, reps: "15, 12, 10" },
                { category: "Shoulder", exercise: "Dumbbell Front Raise", sets: 3, reps: "15, 12, 10" },
                { category: "Shoulder", exercise: "Side Arm Raises", sets: 3, reps: "15, 12, 10" },
                { category: "Shoulder", exercise: "Cable Upright Row", sets: 3, reps: "15, 12, 10" },
                { category: "Shoulder", exercise: "Dumbbell Shrug", sets: 3, reps: "15, 12, 10" }
            ]
        },
        {
            day: "Friday",
            exercises: [
                { category: "Biceps", exercise: "Dumbbell Curl", sets: 3, reps: "15, 12, 10" },
                { category: "Biceps", exercise: "Barbell Curl", sets: 3, reps: "15, 12, 10" },
                { category: "Biceps", exercise: "Preacher Curl", sets: 3, reps: "15, 12, 10" },
                { category: "Biceps", exercise: "Arm Blaster Hammer Curl", sets: 3, reps: "15, 12, 10" }
            ]
        },
        {
            day: "Saturday",
            exercises: [
                { category: "Full Body/Cardio", exercise: "Treadmill", sets: 1, reps: "20 Minutes" },
                { category: "Abs", exercise: "Crunches", sets: 3, reps: "20" },
                { category: "Abs", exercise: "Leg Raises", sets: 3, reps: "20" }
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

        console.log("✅ Successfully added Workout: Body Building");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding workout:", error);
        process.exit(1);
    }
}

seedWorkout();
