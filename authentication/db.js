const mongoose = require('mongoose');
require('dotenv').config();
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fastMoneyMachine';
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        return console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection failed:', err);
        process.exit(1);
    }
};

module.exports = connectDB;