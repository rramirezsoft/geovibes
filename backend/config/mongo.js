require('dotenv').config();
const mongoose = require('mongoose');

const clientOptions = { 
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
};

const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, clientOptions);
        console.log('✅ Conectado a MongoDB');
    } catch (err) {
        console.error('❌ Error al conectar a MongoDB:', err);
        throw err;
    }
}

module.exports = { connectMongoDB }