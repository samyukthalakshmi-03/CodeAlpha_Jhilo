require('dotenv').config();

module.exports = {
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/social-media',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production',
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development'
};
