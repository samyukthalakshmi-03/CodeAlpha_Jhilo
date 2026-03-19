const express = require('express');
const createApp = require('./app');
const connectDB = require('./db');
const config = require('./config');

(async () => {
  await connectDB();

  const app = createApp();
  
  // Wrap the app to serve under /api prefix for local development consistency
  const mainApp = express();
  mainApp.use('/api', app);
  
  const PORT = config.port;

  mainApp.listen(PORT, () => {
    console.log(`Server running on port ${PORT} with /api prefix`);
  });
})();
