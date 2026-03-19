const createApp = require('./app');
const connectDB = require('./db');
const config = require('./config');

(async () => {
  await connectDB();

  const app = createApp();
  const PORT = config.port;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
