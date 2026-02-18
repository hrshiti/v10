const mongoose = require('mongoose');
require('dotenv').config();

const checkSuspiciousDates = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const Member = require('./models/Member');

        const suspicious = await Member.find({
            $or: [
                { endDate: { $lt: new Date('2000-01-01') } },
                { endDate: { $exists: false } },
                { endDate: null }
            ]
        });

        console.log(`Found ${suspicious.length} members with suspicious endDates.`);
        suspicious.slice(0, 10).forEach(s => {
            console.log(`${s.firstName} ${s.lastName}: ${s.endDate}, Status: ${s.status}`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkSuspiciousDates();
