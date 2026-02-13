const mongoose = require('mongoose');
require('dotenv').config();
const Member = require('../models/Member');
const { sendMulticastNotification } = require('../utils/pushNotification');

const testPush = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const mobile = '9669002380';
        const member = await Member.findOne({ mobile });

        if (!member) {
            console.error('Member not found');
            process.exit(1);
        }

        console.log(`Found Member: ${member.firstName} ${member.lastName}`);
        console.log('FCM Tokens:', JSON.stringify(member.fcmTokens, null, 2));

        const tokens = [member.fcmTokens?.web, member.fcmTokens?.app].filter(t => t);

        if (tokens.length === 0) {
            console.log('No tokens found for this member.');
            process.exit(0);
        }

        console.log(`Sending test notification to ${tokens.length} tokens...`);

        const result = await sendMulticastNotification(
            tokens,
            'Script Test Notification',
            'Hello! This is a test notification from the server script.',
            { click_action: '/profile' }
        );

        console.log('Result:', result ? 'Success' : 'Failed');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

testPush();
