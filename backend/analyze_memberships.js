const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const Member = require('./models/Member');
const Subscription = require('./models/Subscription');
const Sale = require('./models/Sale');

const analyzeAndFix = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to Database...');

        // 1. Identify Duplicate/Overlapping Subscriptions for members
        const subscriptions = await Subscription.find().sort({ memberId: 1, createdAt: 1 });

        console.log(`Total Subscriptions: ${subscriptions.length}`);

        const memberMap = {};
        subscriptions.forEach(sub => {
            if (!memberMap[sub.memberId]) {
                memberMap[sub.memberId] = [];
            }
            memberMap[sub.memberId].push(sub);
        });

        console.log('\n--- Duplicate Analysis ---');
        for (const memberId in memberMap) {
            const subs = memberMap[memberId];
            if (subs.length > 1) {
                // Check for records created within 1 minute of each other with same package
                for (let i = 0; i < subs.length; i++) {
                    for (let j = i + 1; j < subs.length; j++) {
                        const sub1 = subs[i];
                        const sub2 = subs[j];

                        const timeDiff = Math.abs(sub1.createdAt - sub2.createdAt);
                        const samePackage = sub1.packageId?.toString() === sub2.packageId?.toString() || sub1.packageNameStatic === sub2.packageNameStatic;

                        if (timeDiff < 60000 && samePackage) {
                            console.log(`Potential Duplicate found for Member: ${memberId}`);
                            console.log(`  Sub 1: ${sub1._id} (${sub1.createdAt}) - ₹${sub1.paidAmount}`);
                            console.log(`  Sub 2: ${sub2._id} (${sub2.createdAt}) - ₹${sub2.paidAmount}`);
                        }
                    }
                }
            }
        }

        // 2. Identify "Active" status in "Past" (isCurrent: false)
        const pastActive = await Subscription.find({ isCurrent: false, status: 'Active' });
        console.log(`\nFound ${pastActive.length} subscriptions that are 'Active' but not 'Current'.`);

        // 3. Explanation of Calculation Logic vs Findings
        // We won't perform any deletions yet, just analysis.

        console.log('\nAnalysis Complete.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

analyzeAndFix();
