const mongoose = require('mongoose');
require('dotenv').config();

const analyzeExpiringSoon = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const Member = require('./models/Member');

        const startFeb = new Date('2026-02-01');
        const endFeb = new Date('2026-02-28T23:59:59.999Z');
        const today = new Date();

        const query = {
            status: 'Active',
            endDate: {
                $gte: today, // Future
                $lte: endFeb
            }
        };

        const count = await Member.countDocuments(query);
        console.log('Members Expiring Soon (Rest of Feb 2026):', count);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

analyzeExpiringSoon();
