require('dotenv').config();
const mongoose = require('mongoose');
const Member = require('./models/Member');
const Subscription = require('./models/Subscription');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fitness')
    .then(async () => {
        const member = await Member.findOne({ memberId: 'M479880594' });
        const sub = await Subscription.findOne({ memberId: member._id }).sort({ createdAt: -1 });
        console.log("Sub totalAmount:", sub.totalAmount);
        process.exit();
    });
