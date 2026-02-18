const mongoose = require('mongoose');
require('dotenv').config();
const Workout = require('./models/Workout');

const workoutsToAdd = [
    {
        name: "7 Days Level 1 - Full Body",
        privacyMode: "Public",
        schedule: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => ({
            day,
            exercises: [
                { category: "Chest", exercise: "Chest Press", sets: 3, reps: "15" },
                { category: "Chest", exercise: "Pec Fly", sets: 3, reps: "15" },
                { category: "Shoulder", exercise: "Shoulder Press", sets: 3, reps: "15" },
                { category: "Back", exercise: "Lat Pulldown", sets: 3, reps: "15" },
                { category: "Back", exercise: "Back Rowing Machine", sets: 3, reps: "15" },
                { category: "Back", exercise: "T-Bar Row", sets: 3, reps: "15" },
                { category: "Back", exercise: "Lat Pulldown (Free Weight)", sets: 3, reps: "15" },
                { category: "Biceps", exercise: "Preacher Curl Machine", sets: 3, reps: "15" },
                { category: "Leg", exercise: "Leg Press Machine", sets: 3, reps: "15" },
                { category: "Leg", exercise: "Leg Curl", sets: 3, reps: "15" },
                { category: "Leg", exercise: "Leg Extension", sets: 3, reps: "15" },
                { category: "Leg", exercise: "Seated Calf Raises", sets: 3, reps: "15" }
            ]
        })).concat([{ day: "Sunday", exercises: [] }])
    },
    {
        name: "Muscle Gain Level 2 - Bodybuilding",
        privacyMode: "Public",
        schedule: [
            {
                day: "Monday",
                exercises: [
                    { category: "Chest", exercise: "Flat Barbell Press", sets: 3, reps: "12-15" },
                    { category: "Chest", exercise: "Incline Barbell Press", sets: 3, reps: "12-15" },
                    { category: "Chest", exercise: "Flat Dumbbell Press", sets: 3, reps: "12-15" },
                    { category: "Chest", exercise: "Pec Fly", sets: 3, reps: "12-15" },
                    { category: "Chest", exercise: "Chest Press Machine", sets: 3, reps: "12-15" }
                ]
            },
            {
                day: "Tuesday",
                exercises: [
                    { category: "Shoulder", exercise: "Shoulder Press Machine", sets: 3, reps: "12-15" },
                    { category: "Shoulder", exercise: "Barbell Press", sets: 3, reps: "12-15" },
                    { category: "Shoulder", exercise: "Shoulder Front Raise", sets: 3, reps: "12-15" },
                    { category: "Shoulder", exercise: "Dumbbell Lateral Raise (Both Hands)", sets: 3, reps: "12-15" },
                    { category: "Shoulder", exercise: "Dumbbell Shrugs", sets: 3, reps: "12-15" }
                ]
            },
            {
                day: "Wednesday",
                exercises: [
                    { category: "Back", exercise: "Lat Pulldown", sets: 3, reps: "12-15" },
                    { category: "Back", exercise: "Back Rowing Machine", sets: 3, reps: "12-15" },
                    { category: "Back", exercise: "Seated Cable Row", sets: 3, reps: "12-15" },
                    { category: "Back", exercise: "T-Bar Row", sets: 3, reps: "12-15" },
                    { category: "Back", exercise: "Deadlift", sets: 3, reps: "12-15" }
                ]
            },
            {
                day: "Thursday",
                exercises: [
                    { category: "Biceps", exercise: "Dumbbell Curl", sets: 3, reps: "12-15" },
                    { category: "Biceps", exercise: "Barbell Curl", sets: 3, reps: "12-15" },
                    { category: "Biceps", exercise: "Preacher Curl (Biceps Machine)", sets: 3, reps: "12-15" },
                    { category: "Biceps", exercise: "Hammer Curl (Dumbbell)", sets: 3, reps: "12-15" },
                    { category: "Biceps", exercise: "Pulley Biceps Curl", sets: 3, reps: "12-15" }
                ]
            },
            {
                day: "Friday",
                exercises: [
                    { category: "Triceps", exercise: "Barbell Triceps Curl", sets: 3, reps: "12-15" },
                    { category: "Triceps", exercise: "Lying Barbell Triceps Curl", sets: 3, reps: "12-15" },
                    { category: "Triceps", exercise: "Dumbbell Triceps Extension", sets: 3, reps: "12-15" },
                    { category: "Triceps", exercise: "Single Hand Dumbbell Triceps Extension", sets: 3, reps: "12-15" },
                    { category: "Triceps", exercise: "Pulley Pushdown (Triceps)", sets: 3, reps: "12-15" }
                ]
            },
            {
                day: "Saturday",
                exercises: [
                    { category: "Leg", exercise: "Machine Leg Press", sets: 3, reps: "12-15" },
                    { category: "Leg", exercise: "Leg Extension", sets: 3, reps: "12-15" },
                    { category: "Leg", exercise: "Leg Curl", sets: 3, reps: "12-15" },
                    { category: "Leg", exercise: "Lying Leg Press", sets: 3, reps: "12-15" },
                    { category: "Leg", exercise: "Lunges", sets: 3, reps: "12-15" }
                ]
            },
            { day: "Sunday", exercises: [] }
        ]
    },
    {
        name: "Double Set Training Level 3",
        privacyMode: "Public",
        schedule: [
            {
                day: "Monday",
                exercises: [
                    { category: "Chest", exercise: "Flat Barbell Press", sets: 3, reps: "10-12" },
                    { category: "Chest", exercise: "Incline Barbell Press", sets: 3, reps: "10-12" },
                    { category: "Chest", exercise: "Flat Dumbbell Press", sets: 3, reps: "10-12" },
                    { category: "Chest", exercise: "Chest Press Machine", sets: 3, reps: "10-12" },
                    { category: "Triceps", exercise: "Barbell Triceps Curl", sets: 3, reps: "10-12" },
                    { category: "Triceps", exercise: "Lying Barbell Triceps Curl", sets: 3, reps: "10-12" },
                    { category: "Triceps", exercise: "Dumbbell Triceps Extension", sets: 3, reps: "10-12" }
                ]
            },
            {
                day: "Tuesday",
                exercises: [
                    { category: "Back", exercise: "Lat Pulldown", sets: 3, reps: "10-12" },
                    { category: "Back", exercise: "Back Rowing Machine", sets: 3, reps: "10-12" },
                    { category: "Back", exercise: "Seated Cable Row", sets: 3, reps: "10-12" },
                    { category: "Back", exercise: "T-Bar Row", sets: 3, reps: "10-12" },
                    { category: "Biceps", exercise: "Dumbbell Curl", sets: 3, reps: "10-12" },
                    { category: "Biceps", exercise: "Barbell Curl", sets: 3, reps: "10-12" },
                    { category: "Biceps", exercise: "Hammer Curl (Dumbbell)", sets: 3, reps: "10-12" }
                ]
            },
            {
                day: "Wednesday",
                exercises: [
                    { category: "Shoulder", exercise: "Dumbbell Shoulder Press", sets: 3, reps: "10-12" },
                    { category: "Shoulder", exercise: "Shoulder Front Raise", sets: 3, reps: "10-12" },
                    { category: "Shoulder", exercise: "Dumbbell Lateral Raise", sets: 3, reps: "10-12" },
                    { category: "Shoulder", exercise: "Dumbbell Shrugs", sets: 3, reps: "10-12" },
                    { category: "Triceps", exercise: "Pulley Pushdown", sets: 3, reps: "10-12" },
                    { category: "Triceps", exercise: "Single Hand Dumbbell Triceps Extension", sets: 3, reps: "10-12" },
                    { category: "Triceps", exercise: "Lying Back Triceps Curl", sets: 3, reps: "10-12" }
                ]
            },
            {
                day: "Thursday",
                exercises: [
                    { category: "Leg", exercise: "Squat", sets: 3, reps: "10-12" },
                    { category: "Leg", exercise: "Leg Press", sets: 3, reps: "10-12" },
                    { category: "Leg", exercise: "Leg Extension", sets: 3, reps: "10-12" },
                    { category: "Leg", exercise: "Leg Curl", sets: 3, reps: "10-12" },
                    { category: "Biceps", exercise: "Dumbbell Curl", sets: 3, reps: "10-12" },
                    { category: "Biceps", exercise: "Barbell Curl", sets: 3, reps: "10-12" },
                    { category: "Biceps", exercise: "Hammer Curl (Dumbbell)", sets: 3, reps: "10-12" }
                ]
            },
            {
                day: "Friday",
                exercises: [
                    { category: "Chest", exercise: "Flat Barbell Press", sets: 3, reps: "10-12" },
                    { category: "Chest", exercise: "Incline Barbell Press", sets: 3, reps: "10-12" },
                    { category: "Triceps", exercise: "Pulley Pushdown", sets: 3, reps: "10-12" },
                    { category: "Triceps", exercise: "Shield Pushup", sets: 3, reps: "15" }
                ]
            },
            {
                day: "Saturday",
                exercises: [
                    { category: "Back", exercise: "Lat Pulldown", sets: 3, reps: "10-12" },
                    { category: "Biceps", exercise: "Dumbbell Curl", sets: 3, reps: "10-12" },
                    { category: "Cardio", exercise: "Treadmill", sets: 1, reps: "15 Minutes" }
                ]
            },
            { day: "Sunday", exercises: [] }
        ]
    },
    {
        name: "Fat Loss Level 1 - Cardio Plan",
        privacyMode: "Public",
        schedule: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => ({
            day,
            exercises: [
                { category: "Cardio", exercise: "Spin Bike", sets: 1, reps: "10 Minutes" },
                { category: "Cardio", exercise: "Cross Trainer", sets: 1, reps: "10 Minutes" },
                { category: "Cardio", exercise: "Treadmill", sets: 1, reps: "10 Minutes" },
                { category: "Abs", exercise: "Abs Workout", sets: 3, reps: "20 Minutes" },
                { category: "Cardio", exercise: "Steppers", sets: 1, reps: "10 Minutes" }
            ]
        })).concat([{ day: "Sunday", exercises: [] }])
    }
];

async function seedCurated() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        for (const data of workoutsToAdd) {
            const workout = new Workout(data);
            await workout.save();
            console.log(`✅ Added: ${data.name}`);
        }

        console.log("\n✨ All curated workouts added successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding curated workouts:", error);
        process.exit(1);
    }
}

seedCurated();
