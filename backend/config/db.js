const dns = require('dns');
const mongoose = require('mongoose');

if (process.env.RENDER !== 'true') {
    dns.setServers(['1.1.1.1']);
}

const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const isAtlas = process.env.MONGO_URI.startsWith('mongodb+srv://');
    console.log(isAtlas ? 'Connected to MongoDB Atlas' : 'Connected to MongoDB');
};

module.exports = connectDB;