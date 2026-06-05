require('dotenv').config();
const mongoose = require('mongoose');
const Member = require('./models/Member');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fitness')
    .then(async () => {
        const member = await Member.findOne({ memberId: 'M479880594' });
        console.log("Member data:", member.totalAmount, member.paidAmount, member.discount, member.dueAmount);
        process.exit();
    });
