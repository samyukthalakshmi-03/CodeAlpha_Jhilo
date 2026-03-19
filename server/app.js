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
  // Keep routes prefix-less here, let the mounting handler decide.
  // This makes it work both locally and on Vercel more easily.
  app.use('/auth', authRoutes);
  app.use('/users', userRoutes);
  app.use('/posts', postRoutes);
  app.use('/comments', commentRoutes);
  app.use('/notifications', notificationRoutes);

  // Health check
  app.get('/health', (req, res) => {
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
