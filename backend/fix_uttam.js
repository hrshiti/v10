require('dotenv').config();
const mongoose = require('mongoose');
const Member = require('./models/Member');
const Subscription = require('./models/Subscription');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fitness')
    .then(async () => {
        console.log("Connected to DB");
        const member = await Member.findOne({ memberId: 'M479880594' });
        if (!member) {
            console.log("Member not found");
            process.exit(1);
        }

        const sub = await Subscription.findOne({ memberId: member._id }).sort({ createdAt: -1 });
        if (sub) {
            console.log("Found subscription. Current paidAmount:", sub.paidAmount, "Due:", sub.dueAmount);
            sub.paidAmount = 3000;
            await sub.save();
            console.log("Updated subscription. New Due:", sub.dueAmount);
        } else {
            console.log("No subscription found");
        }
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
