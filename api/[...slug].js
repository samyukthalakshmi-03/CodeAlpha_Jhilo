const createApp = require('../server/app');
const connectDB = require('../server/db');

let appInstance;

module.exports = async (req, res) => {
  try {
    if (!appInstance) {
      appInstance = createApp();
    }
    await connectDB();
    
    // Vercel routes the request to this file for /api/* requests.
    // Our Express app routes are defined WITHOUT the /api prefix (e.g., /auth/login).
    // If req.url is /api/auth/login, we strip the /api prefix so it matches.
    if (req.url.startsWith('/api')) {
      req.url = req.url.replace('/api', '');
    }
    
    // Some Vercel environments might leave an empty string if it was just /api
    if (req.url === '') {
      req.url = '/';
    }
    
    // Log URL to Vercel logs to help with debugging if needed
    console.log(`Routing request: ${req.method} ${req.url}`);
    
    return appInstance(req, res);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message 
    });
  }
};
