require('dotenv').config();
const mongoose = require('mongoose');
const Subscription = require('./models/Subscription');
const Sale = require('./models/Sale');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fitness')
    .then(async () => {
        console.log("Connected to DB");

        const subscriptions = await Subscription.find({});
        let updatedCount = 0;

        for (const sub of subscriptions) {
            // Find the corresponding Sale record
            const sale = await Sale.findOne({ memberId: sub.memberId, type: 'New Membership' }).sort({ createdAt: -1 });
            if (sale) {
                if (sub.paidAmount > sale.amount) {
                    // This was corrupted by the bug!
                    sub.paidAmount = sale.amount;
                    // Pre-save hook will correctly calculate dueAmount
                    await sub.save();
                    updatedCount++;
                    console.log(`Fixed subscription for member ${sub.memberId}, paidAmount is now ${sub.paidAmount}`);
                }
            }
        }

        console.log(`Fixed ${updatedCount} subscriptions.`);
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
