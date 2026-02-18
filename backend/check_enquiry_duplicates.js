const mongoose = require('mongoose');
require('dotenv').config();

async function checkEnquiryDuplicates() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const enquiries = await mongoose.connection.collection('enquiries').find({}).toArray();
        console.log(`Total Enquiries: ${enquiries.length}`);

        const mobileMap = {};
        enquiries.forEach(e => {
            const mobile = String(e.mobile || e['Mobile Number'] || '').trim();
            if (!mobile) return;
            if (!mobileMap[mobile]) mobileMap[mobile] = [];
            mobileMap[mobile].push(e);
        });

        const duplicates = Object.entries(mobileMap).filter(([mob, list]) => list.length > 1);
        console.log(`Unique Mobiles with multiple entries: ${duplicates.length}`);

        duplicates.slice(0, 5).forEach(([mob, list]) => {
            console.log(`Mobile: ${mob}, Count: ${list.length}`);
            list.forEach(item => {
                console.log(`  - _id: ${item._id}, Name: ${item.name}, CreatedAt: ${item.createdAt || item.date}`);
            });
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkEnquiryDuplicates();
