const mongoose = require('mongoose');
require('dotenv').config();

const analyzeExpired = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const Member = require('./models/Member');

        const total = await Member.countDocuments();
        const statusExpired = await Member.countDocuments({ status: 'Expired' });

        const today = new Date();
        const activeButPast = await Member.countDocuments({
            status: 'Active',
            endDate: { $lt: today }
        });

        console.log('--- Member Analysis ---');
        console.log('Total Members:', total);
        console.log('Status "Expired":', statusExpired);
        console.log('Active but endDate past:', activeButPast);
        console.log('Combined criteria (status Expired OR Active with past end date):',
            await Member.countDocuments({
                $or: [
                    { status: 'Expired' },
                    { status: 'Active', endDate: { $lt: today } }
                ]
            })
        );

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

analyzeExpired();
