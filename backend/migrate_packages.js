const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const Package = mongoose.connection.db.collection('packages');
        const Member = mongoose.connection.db.collection('members');
        const Subscription = mongoose.connection.db.collection('subscriptions');

        const packages = await Package.find({ isDeleted: false }).toArray();
        console.log(`Found ${packages.length} active packages:`, packages.map(p => p.name));

        // 1. Migrate Members
        const members = await Member.find({}).toArray();
        let memberUpdated = 0;
        for (const m of members) {
            // Find package by exact name OR partial match (first 10 chars)
            let pkg = packages.find(p => p.name === m.packageName);
            if (!pkg && m.packageName && m.packageName.length >= 3) {
                pkg = packages.find(p => p.name.startsWith(m.packageName) || m.packageName.startsWith(p.name.substring(0, 10)));
            }

            if (pkg) {
                await Member.updateOne({ _id: m._id }, {
                    $set: {
                        packageId: pkg._id,
                        packageName: pkg.name // Also fix the truncated string
                    }
                });
                memberUpdated++;
            }
        }
        console.log(`Updated ${memberUpdated} members with packageId.`);

        // 2. Migrate Subscriptions
        const subscriptions = await Subscription.find({}).toArray();
        let subUpdated = 0;
        for (const s of subscriptions) {
            let pkg = packages.find(p => p.name === s.packageName);
            if (!pkg && s.packageName && s.packageName.length >= 3) {
                pkg = packages.find(p => p.name.startsWith(s.packageName) || s.packageName.startsWith(p.name.substring(0, 10)));
            }

            if (pkg) {
                await Subscription.updateOne({ _id: s._id }, {
                    $set: {
                        packageId: pkg._id,
                        packageName: pkg.name
                    }
                });
                subUpdated++;
            }
        }
        console.log(`Updated ${subUpdated} subscriptions with packageId.`);

        console.log('Migration complete!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrate();
