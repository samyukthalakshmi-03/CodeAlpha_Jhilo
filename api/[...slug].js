const serverless = require('serverless-http');
const createApp = require('../server/app');
const connectDB = require('../server/db');

let handler;

module.exports = async (req, res) => {
  if (!handler) {
    await connectDB();
    const app = createApp();
    handler = serverless(app);
  }
  return handler(req, res);
};
