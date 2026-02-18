const mongoose = require('mongoose');
require('dotenv').config();

const DietPlan = require('./models/DietPlan');

const dietPlansData = [
    {
        name: "Non-Veg Muscle Gain Diet Plan",
        privacyMode: "Public",
        meals: [
            { timing: "06:30", mealType: "Early Morning", itemName: "Energy Booster Shake / Variety Options", description: "Option 1: 1 glass milk, 1 banana, 5 almonds, 2 anjeer, 2 khajur, 6 pista, 15-20 kishmish, 2 spoons honey. \nOption 2: 1 scoop Whey Protein + 1 Apple + 5 Walnuts. \nOption 3: Sattu Drink (30g) with Jaggery and light milk.", foodType: "NON-VEG" },
            { timing: "10:00", mealType: "Mid-Morning", itemName: "Omelette & Carbs", description: "3 egg omelette with Brown bread / Rice / Paratha", foodType: "NON-VEG" },
            { timing: "13:30", mealType: "Lunch", itemName: "High Protein Lunch", description: "100 gm rice, Potato sabji, 100-150 gm boiled chicken / fish / mutton, Green salad, Curd or Buttermilk", foodType: "NON-VEG" },
            { timing: "17:00", mealType: "Evening Snack", itemName: "Light Fuel", description: "1 glass milk, 1 banana", foodType: "VEG" },
            { timing: "19:00", mealType: "2nd Evening Snack", itemName: "Evening Protein", description: "2 whole eggs + 3 egg whites", foodType: "NON-VEG" },
            { timing: "21:00", mealType: "Dinner", itemName: "Muscle Repair Dinner", description: "2 roti, Potato sabji, 2 bowls rice, Green salad, Buttermilk", foodType: "VEG" },
            { timing: "23:00", mealType: "Bed Time", itemName: "Recovery Shake", description: "Milkshake (same as morning)", foodType: "VEG" }
        ]
    },
    {
        name: "Veg Muscle Gain Diet Plan",
        privacyMode: "Public",
        meals: [
            { timing: "06:30", mealType: "Early Morning", itemName: "Morning Shake / Variety Options", description: "Option 1: 1 glass milk, 1 banana, 5 almonds, 2 anjeer, 2 khajur, 6 pista, 15-20 kishmish, 2 spoons honey. \nOption 2: Soaked Peanuts (30g) + 1 Banana + Glass of Milk. \nOption 3: 100g Paneer cubes with pinch of black pepper.", foodType: "VEG" },
            { timing: "10:00", mealType: "Mid-Morning", itemName: "Protein Oats/Daliya", description: "100 gm protein oats OR daliya", foodType: "VEG" },
            { timing: "13:30", mealType: "Lunch", itemName: "Veg Power Lunch", description: "2 roti, Potato sabji, 2 bowls rice, Green salad, Buttermilk", foodType: "VEG" },
            { timing: "17:00", mealType: "Evening Snack", itemName: "Evening Fuel", description: "1 glass milk, 2-3 bananas", foodType: "VEG" },
            { timing: "19:00", mealType: "2nd Evening Snack", itemName: "Protein Bridge", description: "100 gm chana OR moong dal OR tomato soup", foodType: "VEG" },
            { timing: "21:00", mealType: "Dinner", itemName: "Strength Dinner", description: "2 roti, Potato sabji, 2 bowls rice, Green salad, Buttermilk", foodType: "VEG" },
            { timing: "23:00", mealType: "Bed Time", itemName: "Sleep Shake", description: "Milkshake (same as morning)", foodType: "VEG" }
        ]
    },
    {
        name: "Non-Veg Fat Loss Diet Plan",
        privacyMode: "Public",
        meals: [
            { timing: "06:30", mealType: "Early Morning", itemName: "Metabolism Kickstart", description: "Option 1: Warm water + lemon. \nOption 2: ACV (1 spoon) in lukewarm water. \nOption 3: Black Coffee (No sugar).", foodType: "VEG" },
            { timing: "09:00", mealType: "Morning", itemName: "Lean Morning Meal", description: "100 gm protein oats, 2 eggs OR daliya OR sprouts", foodType: "NON-VEG" },
            { timing: "13:30", mealType: "Lunch", itemName: "Shredded Lunch", description: "50 gm rice, 100 gm boiled chicken / fish / mutton, Green salad, Curd or Buttermilk", foodType: "NON-VEG" },
            { timing: "16:30", mealType: "Evening Snack", itemName: "Fruit Break", description: "Any one fruit (Apple/Papaya preferred)", foodType: "VEG" },
            { timing: "18:30", mealType: "2nd Evening Snack", itemName: "Pure Protein", description: "4 egg whites", foodType: "NON-VEG" },
            { timing: "20:30", mealType: "Dinner", itemName: "Lean Dinner", description: "50 gm rice, 100 gm boiled chicken, Green salad, Buttermilk", foodType: "NON-VEG" }
        ]
    },
    {
        name: "Veg Fat Loss Diet Plan",
        privacyMode: "Public",
        meals: [
            { timing: "06:30", mealType: "Early Morning", itemName: "Detox Start", description: "Option 1: Warm water + lemon. \nOption 2: Jeera/Ajwain Water (Soaked overnight). \nOption 3: Green Tea with Ginger.", foodType: "VEG" },
            { timing: "09:00", mealType: "Morning", itemName: "High Fiber Breakfast", description: "100 gm protein oats OR daliya OR sprouts", foodType: "VEG" },
            { timing: "13:30", mealType: "Lunch", itemName: "Light Veg Lunch", description: "100 gm boiled dal, Green salad, Buttermilk or Curd", foodType: "VEG" },
            { timing: "16:30", mealType: "Evening Snack", itemName: "Low Calorie Fruit", description: "Any one fruit", foodType: "VEG" },
            { timing: "18:30", mealType: "2nd Evening Snack", itemName: "Evening Detox", description: "Green tea OR Black tea", foodType: "VEG" },
            { timing: "20:30", mealType: "Dinner", itemName: "Light Ending", description: "100 gm boiled dal, Green salad, Buttermilk or Curd", foodType: "VEG" }
        ]
    }
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const seedDietPlans = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        // Delete previous seeded plans to start fresh
        const planNames = dietPlansData.map(p => p.name);
        await DietPlan.deleteMany({ name: { $in: planNames } });

        for (const planData of dietPlansData) {
            const weeklyPlan = days.map(day => ({
                day: day,
                meals: planData.meals.map(meal => ({
                    ...meal,
                    quantity: "1",
                    unit: "Serving"
                }))
            }));

            const dietPlan = new DietPlan({
                name: planData.name,
                privacyMode: planData.privacyMode,
                weeklyPlan: weeklyPlan,
                status: 'Active'
            });

            await dietPlan.save();
            console.log(`Saved: ${planData.name}`);
        }

        console.log("Proper diet plans seeded successfully with variety options!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDietPlans();
