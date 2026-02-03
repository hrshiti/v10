const mongoose = require('mongoose');
const Member = require('./models/Member');
const Workout = require('./models/Workout');
const DietPlan = require('./models/DietPlan');
const dotenv = require('dotenv');

dotenv.config();

const seedMemberData = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fitness-lab-v10';
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const mobile = '1234567890';
        const member = await Member.findOne({ mobile });

        if (!member) {
            console.log('Member not found. Run seed_test_user.js first.');
            process.exit(1);
        }

        // 1. Create a Workout Plan
        const existingWorkout = await Workout.findOne({ memberId: member._id });
        if (existingWorkout) {
            console.log('Workout already exists for this member');
        } else {
            const workout = new Workout({
                memberId: member._id,
                name: 'Mass Gainer Phase 1',
                startDate: new Date(),
                endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
                schedule: [
                    {
                        day: 'Monday',
                        workoutType: 'Chest & Triceps',
                        exercises: [
                            { name: 'Bench Press', sets: 4, reps: '12', weight: '40kg' },
                            { name: 'Incline Dumbbell Press', sets: 3, reps: '12', weight: '15kg' },
                            { name: 'Tricep Pushdowns', sets: 4, reps: '15', weight: '20kg' }
                        ]
                    },
                    {
                        day: 'Wednesday',
                        workoutType: 'Back & Biceps',
                        exercises: [
                            { name: 'Lat Pulldowns', sets: 4, reps: '12', weight: '45kg' },
                            { name: 'Seated Rows', sets: 3, reps: '12', weight: '40kg' },
                            { name: 'Bicep Curls', sets: 4, reps: '12', weight: '10kg' }
                        ]
                    }
                ]
            });
            await workout.save();
            console.log('Test Workout Created');
        }

        // 2. Create a Diet Plan
        const existingDiet = await DietPlan.findOne({ assignedMembers: member._id });
        if (existingDiet) {
            console.log('Diet Plan already exists for this member');
        } else {
            const diet = new DietPlan({
                name: 'High Protein Bulk',
                assignedMembers: [member._id],
                weeklyPlan: [
                    {
                        day: 'Monday',
                        meals: [
                            { mealType: 'Breakfast', itemName: 'Oats with Peanut Butter', foodType: 'Veg', timing: '08:00', quantity: 100, unit: 'g' },
                            { mealType: 'Lunch', itemName: 'Chicken Breast with Brown Rice', foodType: 'Non-Veg', timing: '13:00', quantity: 200, unit: 'g' },
                            { mealType: 'Dinner', itemName: 'Paneer Salad', foodType: 'Veg', timing: '20:00', quantity: 150, unit: 'g' }
                        ]
                    }
                ]
            });
            await diet.save();
            console.log('Test Diet Plan Created');
        }

        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedMemberData();
