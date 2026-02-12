const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const check = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const Member = mongoose.connection.db.collection('members');
    const emptyCount = await Member.countDocuments({
        $or: [
            { packageName: { $exists: false } },
            { packageName: "" },
            { packageName: null }
        ]
    });
    console.log('Members with missing/empty packageName:', emptyCount);

    const missingPkgId = await Member.countDocuments({
        $or: [
            { packageId: { $exists: false } },
            { packageId: null }
        ]
    });
    console.log('Members with missing/null packageId:', missingPkgId);

    const samples = await Member.find({}).limit(10).toArray();
    samples.forEach(m => {
        console.log(`Member: ${m.firstName} | packageName: ${m.packageName} | packageId: ${m.packageId}`);
    });

    process.exit(0);
};

check();
