const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Member = require('./models/Member');
const Subscription = require('./models/Subscription');

const syncJohnDoe = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const member = await Member.findOne({ memberId: 'M93389' });
        if (!member) {
            console.log('Member not found');
            return;
        }

        // 1. Get the real CURRENT active subscription
        const currentSub = await Subscription.findOne({ memberId: member._id, isCurrent: true });

        if (currentSub) {
            // Recalculate global due based on this sub's commitment
            // Example from screenshot: Plan price seems to be 5000 (total), paid 3000.
            // If the latest sub has paidAmount 3000 but the package price was 5000:
            const packagePrice = 5000; // Hardcoded based on your specific case example to fix the data

            member.dueAmount = Math.max(0, packagePrice - (currentSub.paidAmount + currentSub.discount));

            // Also cleanup Member's incorrect cumulative totals
            member.totalAmount = packagePrice;

            await member.save();
            console.log(`Sync complete for John Doe. New Due: ₹${member.dueAmount}`);
        }

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

syncJohnDoe();
