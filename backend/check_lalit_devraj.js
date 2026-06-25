require('dotenv').config();
const mongoose = require('mongoose');
const Member = require('./models/Member');
const Subscription = require('./models/Subscription');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fitness')
    .then(async () => {
        try {
            console.log("Searching for Lalit and Devraj by firstName/lastName...");
            const members = await Member.find({ 
                $or: [
                    { firstName: { $regex: /lalit|devraj/i } },
                    { lastName: { $regex: /lalit|devraj/i } }
                ]
            });

            if (members.length === 0) {
                console.log("No members found with names lalit or devraj");
            }

            for (const member of members) {
                console.log(`\n--- Member: ${member.firstName} ${member.lastName} (ID: ${member.memberId}, _id: ${member._id}) ---`);
                console.log(`Status: ${member.status}`);
                console.log(`totalAmount: ${member.totalAmount}, paidAmount: ${member.paidAmount}, discount: ${member.discount}, dueAmount: ${member.dueAmount}`);
                
                // Let's check their active subscriptions
                const subs = await Subscription.find({ memberId: member._id });
                console.log(`Found ${subs.length} subscriptions`);
                for (const sub of subs) {
                    console.log(`  Sub ID: ${sub._id}, Status: ${sub.status}`);
                    console.log(`    totalAmount: ${sub.totalAmount}, paidAmount: ${sub.paidAmount}, discount: ${sub.discount}, dueAmount: ${sub.dueAmount}`);
                    console.log(`    paymentStatus: ${sub.paymentStatus}`);
                }
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            process.exit();
        }
    });
