const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const notificationRoutes = require('./routes/notifications');

function createApp() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Routes
  // Support both /api/auth and /auth routes for flexibility across environments
  app.use(['/api/auth', '/auth'], authRoutes);
  app.use(['/api/users', '/users'], userRoutes);
  app.use(['/api/posts', '/posts'], postRoutes);
  app.use(['/api/comments', '/comments'], commentRoutes);
  app.use(['/api/notifications', '/notifications'], notificationRoutes);

  // Health check
  app.get(['/api/health', '/health'], (req, res) => {
    res.json({ message: 'Server is running' });
  });

  // Error handling
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  });

  return app;
}

module.exports = createApp;
