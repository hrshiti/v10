const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const Member = require('./models/Member');

const fixNegativeDues = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const negativeMembers = await Member.find({ dueAmount: { $lt: 0 } });
        console.log(`Found ${negativeMembers.length} members with negative dues.`);

        for (const member of negativeMembers) {
            console.log(`Fixing ${member.firstName} ${member.lastName}: Current Due: ${member.dueAmount}`);
            member.dueAmount = 0;
            // Also need to adjust paidAmount or discount to balance it out if we want consistency,
            // but for now setting dueAmount to 0 is the safest way to fix the report.
            // A better way is to cap the components so that Total - (Paid + Disc) = 0

            await member.save();
            console.log(`Updated.`);
        }

        console.log('Historical data cleanup complete.');
        process.exit(0);
    } catch (error) {
        console.error('Error during cleanup:', error);
        process.exit(1);
    }
};

fixNegativeDues();
