require('dotenv').config();
const mongoose = require('mongoose');
const Member = require('./models/Member');
const Sale = require('./models/Sale');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fitness')
    .then(async () => {
        const member = await Member.findOne({ memberId: 'M479880594' });
        const sale = await Sale.findOne({ memberId: member._id }).sort({ createdAt: -1 });
        console.log("Sale data:", sale);
        process.exit();
    });
