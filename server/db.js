const mongoose = require('mongoose');
const config = require('./config');

let cached = global.__jhilo_mongoose_cache || (global.__jhilo_mongoose_cache = { conn: null, promise: null });

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then((mongooseInstance) => {
        cached.conn = mongooseInstance;
        console.log('MongoDB connected');
        return cached.conn;
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err.message);
        cached.promise = null;
        throw err;
      });
  }

  return cached.promise;
}

module.exports = connectDB;
