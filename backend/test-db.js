const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/fitness')
    .then(async () => {
        try {
            const count = await mongoose.connection.collection('members').countDocuments({ anniversaryDate: { $exists: true } });
            console.log('AnniversaryDate count:', count);
            const member = await mongoose.connection.collection('members').findOne({ anniversaryDate: { $exists: true } });
            console.log('Sample Member:', member);
        } catch (e) {
            console.error(e);
        } finally {
            process.exit(0);
        }
    });
