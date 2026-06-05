const mongoose = require('mongoose');
const Member = require('../models/Member');
const dotenv = require('dotenv');

dotenv.config();

const migrate = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to database.');

        console.log('Fetching existing members...');
        const members = await Member.find().sort({ createdAt: 1 });
        console.log(`Found ${members.length} members to migrate.`);

        let currentSerial = 1;
        for (const member of members) {
            if (!member.serialNumber) {
                member.serialNumber = currentSerial;
                await member.save();
                console.log(`Assigned serial number ${currentSerial} to member ${member.memberId}`);
            }
            currentSerial++;
        }

        console.log('Migration completed successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from database.');
        process.exit(0);
    }
};

migrate();
