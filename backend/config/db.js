const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fitness-lab-v10';
        console.log(`Attempting to connect to MongoDB: ${uri.substring(0, 20)}...`);
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        // Don't kill the process immediately to allow /api/status to work
        // process.exit(1);
    }
};

module.exports = connectDB;
