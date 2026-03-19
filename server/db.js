const mongoose = require('mongoose');
const config = require('./config');

let cached = global.__jhilo_mongoose_cache || (global.__jhilo_mongoose_cache = { conn: null, promise: null });

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('Connecting to MongoDB...');
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // Fast fail if no connection
    };

    cached.promise = mongoose
      .connect(config.mongoURI, opts)
      .then((mongooseInstance) => {
        console.log('MongoDB connected successfully');
        cached.conn = mongooseInstance;
        return cached.conn;
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err.message);
        cached.promise = null;
        // Provide a clearer error for Vercel users
        if (!config.mongoURI || config.mongoURI.includes('localhost')) {
          throw new Error('MongoDB URI is missing or pointing to localhost. Please set MONGO_URI in your environment variables.');
        }
        throw err;
      });
  }

  return cached.promise;
}

module.exports = connectDB;
