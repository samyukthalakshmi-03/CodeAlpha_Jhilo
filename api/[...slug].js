const createApp = require('../server/app');
const connectDB = require('../server/db');

let app;

module.exports = async (req, res) => {
  try {
    if (!app) {
      app = createApp();
    }
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message 
    });
  }
};
