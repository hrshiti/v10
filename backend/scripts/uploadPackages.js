const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Package = require("../models/Package");

async function start() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB Connected ✅");

        // 🔥 Remove old packages
        // await Package.deleteMany({});
        // console.log("Old packages removed ✅");

        const packages = [
            // 🏋️ GYM WORKOUT
            {
                name: "GYM WORKOUT - 1 Month",
                type: "general",
                activity: "gym",
                timing: "anytime",
                description: "Gym workout package for 1 month",
                durationType: "Months",
                durationValue: 1,
                sessions: 30,
                rackRate: 3000,
                baseRate: 2500
            },
            {
                name: "GYM WORKOUT - 3 Month",
                type: "general",
                activity: "gym",
                timing: "anytime",
                description: "Gym workout package for 3 months",
                durationType: "Months",
                durationValue: 3,
                sessions: 90,
                rackRate: 6000,
                baseRate: 5000
            },
            {
                name: "GYM WORKOUT - 6 Month",
                type: "general",
                activity: "gym",
                timing: "anytime",
                description: "Gym workout package for 6 months",
                durationType: "Months",
                durationValue: 6,
                sessions: 180,
                rackRate: 10000,
                baseRate: 7000
            },
            {
                name: "GYM WORKOUT - 12 Month",
                type: "general",
                activity: "gym",
                timing: "anytime",
                description: "Gym workout package for 12 months",
                durationType: "Months",
                durationValue: 12,
                sessions: 360,
                rackRate: 10000,
                baseRate: 9000
            },

            // 🎁 Complementary
            {
                name: "Complementary - 12 Month",
                type: "general",
                activity: "gym",
                timing: "anytime",
                description: "Complementary membership package",
                durationType: "Months",
                durationValue: 12,
                sessions: 360,
                rackRate: 0,
                baseRate: 0
            }
        ];

        await Package.insertMany(packages);

        console.log("Packages Created Successfully 🚀");
        process.exit();

    } catch (error) {
        console.error("Error ❌", error);
        process.exit(1);
    }
}

start();
