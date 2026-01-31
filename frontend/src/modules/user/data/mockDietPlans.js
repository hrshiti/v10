export const dietPlans = [
    {
        id: 1,
        planName: "INSTANT WEIGHT LOSS DIET",
        description: "A rapid weight loss program focusing on low carbs and high fiber.",
        type: "Public",
        days: {
            Monday: {
                Breakfast: [
                    { foodType: "Veg", timing: "07:00 AM", diet: "black coffee / a small fruit / 4 dates", description: "Metabolism booster" },
                    { foodType: "Veg", timing: "08:00 AM", diet: "green tea / skimmed milk + 1 plate veg poha / dhokla", description: "Light start" },
                    { foodType: "Veg", timing: "10:00 AM", diet: "1 plate fresh fruit salad + buttermilk + water + 1 coconut water", description: "Hydration boost" }
                ],
                Lunch: [
                    { foodType: "Non-Veg", timing: "01:00 PM", diet: "Grilled chicken breast + 1 small bowl brown rice + cucumber salad", description: "High protein" },
                    { foodType: "Veg", timing: "01:30 PM", diet: "Buttermilk / clear soup", description: "Digestive aid" }
                ],
                EveningSnacks: [
                    { foodType: "Veg", timing: "04:00 PM", diet: "Green tea + 2 digestive biscuits", description: "Light snack" },
                    { foodType: "Veg", timing: "06:00 PM", diet: "Roasted chana / makhana bowl", description: "Fiber kick" }
                ],
                Dinner: [
                    { foodType: "Veg", timing: "08:00 PM", diet: "1 bowl vegetable soup + 1 multigrain roti + lauki sabzi", description: "Light dinner" },
                    { foodType: "Veg", timing: "09:30 PM", diet: "Chamomile tea / warm water with lemon", description: "Relaxation" }
                ]
            },
            Tuesday: {
                Breakfast: [
                    { foodType: "Veg", timing: "07:00 AM", diet: "Warm water + honey + lemon", description: "Detox" },
                    { foodType: "Veg", timing: "08:00 AM", diet: "Oats porridge with apple slices and cinnamon", description: "Fiber rich" }
                ],
                Lunch: [
                    { foodType: "Veg", timing: "01:00 PM", diet: "2 Roti + Dal Tadka + Mixed Vegetable Salad", description: "Balanced meal" }
                ],
                EveningSnacks: [
                    { foodType: "Veg", timing: "04:30 PM", diet: "Fresh fruit juice (no sugar)", description: "Vitamin boost" }
                ],
                Dinner: [
                    { foodType: "Veg", timing: "08:00 PM", diet: "Boiled vegetables + Grilled Paneer cubes", description: "Low carb" }
                ]
            }
        }
    },
    {
        id: 2,
        planName: "WEIGHT LOSS DIET SCHEDULE",
        description: "Standard balanced diet for sustainable weight loss.",
        type: "Public",
        days: {
            Monday: {
                Breakfast: [
                    { foodType: "Veg", timing: "07:30 AM", diet: "Aloe vera juice + 5 soaked almonds", description: "Gut health" },
                    { foodType: "Veg", timing: "08:30 AM", diet: "2 Idli + Sambhar + Coconut chutney", description: "South Indian classic" }
                ],
                Lunch: [
                    { foodType: "Veg", timing: "01:00 PM", diet: "1 bowl Rajma + 1 bowl Rice + Kachumber salad", description: "Protein & Carbs" }
                ],
                EveningSnacks: [
                    { foodType: "Veg", timing: "05:00 PM", diet: "Tea / Coffee (no sugar) + 2 Marie biscuits", description: "Caffeine fix" }
                ],
                Dinner: [
                    { foodType: "Veg", timing: "08:00 PM", diet: "Khichdi with plain curd", description: "Easy digestion" }
                ]
            }
        }
    },
    {
        id: 3,
        planName: "BODY BUILDING DIET",
        description: "High protein diet for muscle gain and recovery.",
        type: "Public",
        days: {
            Monday: {
                Breakfast: [
                    { foodType: "Non-Veg", timing: "07:00 AM", diet: "6 Egg whites + 2 slices whole wheat toast", description: "Protein packed" },
                    { foodType: "Veg", timing: "09:00 AM", diet: "Banana protein smoothie with peanut butter", description: "Energy boost" }
                ],
                Lunch: [
                    { foodType: "Non-Veg", timing: "12:30 PM", diet: "200g Chicken breast + Quinoa + Broccoli", description: "Lean muscle fuel" }
                ],
                EveningSnacks: [
                    { foodType: "Non-Veg", timing: "05:00 PM", diet: "Boiled egg salad + Sweet potato", description: "Pre-workout" }
                ],
                Dinner: [
                    { foodType: "Non-Veg", timing: "08:30 PM", diet: "Grilled Fish + Asparagus + Mashed cauliflower", description: "Recovery meal" },
                    { foodType: "Veg", timing: "10:00 PM", diet: "Casein protein shake / Cottage cheese", description: "Night recovery" }
                ]
            }
        }
    },
    {
        id: 4,
        planName: "WEIGHT GAIN",
        description: "Calorie surplus diet with healthy fats and carbs.",
        type: "Public",
        days: {
            Monday: {
                Breakfast: [
                    { foodType: "Veg", timing: "07:30 AM", diet: "2 Bananas + 1 glass full cream milk", description: "Calorie start" },
                    { foodType: "Veg", timing: "09:00 AM", diet: "2 Parathas with curd and butter", description: "Heavy breakfast" }
                ],
                Lunch: [
                    { foodType: "Veg", timing: "01:00 PM", diet: "3 Roti + Paneer Butter Masala + Rice + Dal", description: "Full meal" }
                ],
                EveningSnacks: [
                    { foodType: "Veg", timing: "05:00 PM", diet: "Mango milkshake with dry fruits", description: "Calorie dense" }
                ],
                Dinner: [
                    { foodType: "Veg", timing: "09:00 PM", diet: "Vegetable Biryani + Raita + Papad", description: "Fulfilling dinner" }
                ]
            }
        }
    },
    {
        id: 5,
        planName: "HEART HEALTHY & HIGH CHOLESTROL & HIGH BLOOD PRESSURE",
        description: "Low sodium, low fat diet rich in omega-3 and fiber.",
        type: "Public",
        days: {
            Monday: {
                Breakfast: [
                    { foodType: "Veg", timing: "07:00 AM", diet: "Warm water with garlic clove", description: "Heart health" },
                    { foodType: "Veg", timing: "08:00 AM", diet: "Oatmeal with flaxseeds and berries", description: "Cholesterol control" }
                ],
                Lunch: [
                    { foodType: "Veg", timing: "01:00 PM", diet: "Bran Roti + Ghia (Bottle Gourd) Sabzi + Salad", description: "Low fat" }
                ],
                EveningSnacks: [
                    { foodType: "Veg", timing: "04:30 PM", diet: "Walnuts and Almonds (unsalted)", description: "Healthy fats" }
                ],
                Dinner: [
                    { foodType: "Veg", timing: "08:00 PM", diet: "Moong Dal Soup + Grilled Veggies", description: "Light & healthy" }
                ]
            }
        }
    }
];
