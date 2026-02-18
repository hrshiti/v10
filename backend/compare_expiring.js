const mongoose = require('mongoose');
require('dotenv').config();

const countExpiring = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const Member = require('./models/Member');

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const next7 = new Date();
        next7.setDate(today.getDate() + 7);
        next7.setHours(23, 59, 59, 999);

        const next30 = new Date();
        next30.setDate(today.getDate() + 30);
        next30.setHours(23, 59, 59, 999);

        const count7 = await Member.countDocuments({
            status: 'Active',
            endDate: { $gte: today, $lte: next7 }
        });

        const count30 = await Member.countDocuments({
            status: 'Active',
            endDate: { $gte: today, $lte: next30 }
        });

        console.log(`Expiring in 7 days: ${count7}`);
        console.log(`Expiring in 30 days: ${count30}`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

countExpiring();
