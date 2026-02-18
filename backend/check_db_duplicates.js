const mongoose = require('mongoose');
require('dotenv').config();

const checkDbDuplicates = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const Member = require('./models/Member');

        const dups = await Member.aggregate([
            {
                $group: {
                    _id: '$mobile',
                    count: { $sum: 1 },
                    ids: { $push: '$_id' },
                    names: { $push: { $concat: ['$firstName', ' ', '$lastName'] } }
                }
            },
            {
                $match: {
                    count: { $gt: 1 }
                }
            }
        ]);

        console.log(`Found ${dups.length} duplicate mobile numbers.`);
        if (dups.length > 0) {
            console.log('Sample duplicates:');
            dups.slice(0, 5).forEach(d => {
                console.log(`Mobile: ${d._id}, Count: ${d.count}, Names: ${d.names.join(', ')}`);
            });
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkDbDuplicates();
