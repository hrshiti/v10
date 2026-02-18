const mongoose = require('mongoose');
require('dotenv').config();

const checkFeb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const Member = require('./models/Member');

        const startFeb = new Date('2026-02-01');
        const endFeb = new Date('2026-02-28T23:59:59');

        const count = await Member.countDocuments({
            status: 'Active',
            endDate: { $gte: startFeb, $lte: endFeb }
        });

        console.log(`Expiring in Feb 2026: ${count}`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkFeb();
