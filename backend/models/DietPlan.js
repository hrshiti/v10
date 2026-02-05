const mongoose = require('mongoose');

const dietPlanSchema = new mongoose.Schema({
    name: { type: String, required: true },
    privacyMode: { type: String, enum: ['Public', 'Private'], default: 'Public' },
    assignedMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }, // Who created the plan

    // Weekly Structure
    weeklyPlan: [
        {
            day: {
                type: String,
                enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                required: true
            },
            meals: [
                {
                    foodType: { type: String }, // Veg, Non-Veg, etc.
                    mealType: { type: String }, // Breakfast, Lunch, etc.
                    itemName: { type: String, required: true },
                    quantity: { type: String },
                    unit: { type: String }, // g, ml, pieces
                    timing: { type: String }, // hh:mm
                    description: { type: String }
                }
            ]
        }
    ],
    status: { type: String, enum: ['Active', 'Archived'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('DietPlan', dietPlanSchema);
