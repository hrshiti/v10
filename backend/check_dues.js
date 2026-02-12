const mongoose = require('mongoose');
const Member = require('./models/Member');
require('dotenv').config();

const checkData = async () => {
    try {
        await mongoose.connect('mongodb+srv://mayurchadokar14:Mayur123@cluster0.uc7l30b.mongodb.net/v10');
        console.log('Connected to DB');

        const count = await Member.countDocuments({ dueAmount: { $gt: 0 } });
        console.log('Members with dueAmount > 0:', count);

        const withCommitment = await Member.find({
            dueAmount: { $gt: 0 },
            commitmentDate: { $exists: true, $ne: null }
        }).select('firstName lastName dueAmount commitmentDate');

        console.log('Members with commitmentDate set:', withCommitment.length);
        console.log('Sample Data:', JSON.stringify(withCommitment, null, 2));

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkData();
