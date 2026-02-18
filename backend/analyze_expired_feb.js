const mongoose = require('mongoose');
require('dotenv').config();

const analyzeExpiredFeb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const Member = require('./models/Member');

        const startFeb = new Date('2026-02-01');
        const endFeb = new Date('2026-02-28T23:59:59.999Z');
        const today = new Date();

        const query = {
            $or: [
                { status: 'Expired' },
                { status: 'Active', endDate: { $lt: today } }
            ],
            endDate: {
                $gte: startFeb,
                $lte: endFeb
            }
        };

        const count = await Member.countDocuments(query);
        console.log('Members expired/expiring in February 2026:', count);

        // Also check if there are 26 members total with some other criteria
        const statusExpiredNoDate = await Member.countDocuments({ status: 'Expired' });
        console.log('Total Status="Expired" (all time):', statusExpiredNoDate);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

analyzeExpiredFeb();
