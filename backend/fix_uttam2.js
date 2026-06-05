require('dotenv').config();
const mongoose = require('mongoose');
const Member = require('./models/Member');
const Subscription = require('./models/Subscription');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fitness')
    .then(async () => {
        const member = await Member.findOne({ memberId: 'M479880594' });
        if(member) {
            member.discount = 0;
            member.dueAmount = member.totalAmount - member.paidAmount;
            await member.save();
            console.log("Member fixed.");
        }

        const sub = await Subscription.findOne({ memberId: member._id }).sort({ createdAt: -1 });
        if(sub) {
            sub.discount = 0;
            sub.paidAmount = 3000;
            sub.totalAmount = 6000;
            // Pre-save hook will recalculate dueAmount to 3000
            await sub.save();
            console.log("Sub fixed.");
        }
        process.exit();
    });
