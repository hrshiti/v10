const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Member = require('../models/Member');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function checkTokens() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log('--- FCM Token Analysis ---');

        const admins = await Admin.find({ fcmTokens: { $exists: true } });
        console.log(`Admins with tokens: ${admins.length}`);
        admins.forEach(a => {
            console.log(`- Admin: ${a.email}, Web: ${a.fcmTokens?.web ? '✅' : '❌'}, App: ${a.fcmTokens?.app ? '✅' : '❌'}`);
        });

        const members = await Member.find({ fcmTokens: { $exists: true } });
        console.log(`Members with tokens: ${members.length}`);
        members.forEach(m => {
            console.log(`- Member: ${m.firstName} ${m.lastName} (${m.mobile}), Web: ${m.fcmTokens?.web ? '✅' : '❌'}, App: ${m.fcmTokens?.app ? '✅' : '❌'}`);
        });

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkTokens();
