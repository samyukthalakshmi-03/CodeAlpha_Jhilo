# Jhilo - Mini Social Media App

A full-stack social media application built with Express.js, MongoDB, and vanilla JavaScript.

## Features

✨ **User Management**
- User registration and authentication with JWT
- User profiles with bio and avatar
- Follow/Unfollow system
- User discovery/explore feature

📝 **Posts**
- Create, read, update, and delete posts
- Like/Unlike posts
- Comment on posts
- View feed with all posts from followed users

💬 **Comments**
- Add comments to posts
- Like/Unlike comments
- Edit and delete your own comments

## Tech Stack

### Backend
- **Framework**: Express.js (Node.js)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing

### Frontend
- **HTML5** for structure
- **CSS3** for styling (responsive design)
- **JavaScript ES6+** for interactivity
- **Fetch API** for HTTP requests

### Deployment
- **Docker** for containerization
- **Docker Compose** for orchestration
- **Nginx** for frontend serving and API proxy

## Project Structure

```
Jhilo/
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Comment.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── posts.js
│   │   └── comments.js
│   ├── middleware/
│   │   └── auth.js
│   ├── config/
│   │   └── index.js
│   ├── .env
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
├── client/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── docker-compose.yml
├── nginx.conf
└── README.md
```

## Setup & Installation

### Option 1: Using Docker (Recommended)

1. **Prerequisites**
   - Docker and Docker Compose installed

2. **Run the application**
   ```bash
   docker-compose up
   ```

3. **Access the app**
   - Frontend: http://localhost
   - Backend API: http://localhost/api

### Option 2: Manual Setup

1. **Prerequisites**
   - Node.js (v18+)
   - MongoDB running locally

2. **Backend Setup**
   ```bash
   cd server
   npm install
   
   # Update .env file with your MongoDB URI and JWT secret
   npm start
   ```

3. **Frontend Setup**
   ```bash
   # Start a local server for the client folder
   cd client
   npx serve .
   # or use Python: python -m http.server 3000
   ```

4. **Access the app**
   - Frontend: http://localhost:3000 (or your server port)
   - Backend API: http://localhost:5000/api

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:userId` - Get user profile
- `GET /api/users/profile/me` - Get current user profile
- `PUT /api/users/profile/me` - Update current user profile
- `POST /api/users/:userId/follow` - Follow user
- `POST /api/users/:userId/unfollow` - Unfollow user

### Posts
- `GET /api/posts` - Get all posts (feed)
- `GET /api/posts/:postId` - Get post by ID
- `GET /api/posts/user/:userId` - Get user's posts
- `POST /api/posts` - Create post (authenticated)
- `PUT /api/posts/:postId` - Update post (authenticated, author only)
- `DELETE /api/posts/:postId` - Delete post (authenticated, author only)
- `POST /api/posts/:postId/like` - Like post (authenticated)
- `POST /api/posts/:postId/unlike` - Unlike post (authenticated)

### Comments
- `GET /api/comments/post/:postId` - Get post comments
- `POST /api/comments` - Create comment (authenticated)
- `PUT /api/comments/:commentId` - Update comment (authenticated, author only)
- `DELETE /api/comments/:commentId` - Delete comment (authenticated, author only)
- `POST /api/comments/:commentId/like` - Like comment (authenticated)
- `POST /api/comments/:commentId/unlike` - Unlike comment (authenticated)

## Usage Guide

### Registration & Login
1. Go to the app and click "Sign up"
2. Enter username, email, and password
3. Account created! You're automatically logged in
4. Or click "Login" if you already have an account

### Creating Posts
1. On the Feed page, click on "What's on your mind?"
2. Type your content
3. Click "Post"

### Interacting with Posts
- **Like**: Click the heart icon
- **Comment**: Click the comment icon and add your comment
- **Delete**: Click "Delete" button on your own posts

### Following Users
1. Go to Explore page
2. Click "Follow" on any user
3. View follower counts on your Profile

### Editing Profile
1. Go to Profile page
2. Click "Edit Profile"
3. Update bio and avatar URL
4. Click "Save"

## Environment Variables

### Server (.env)
```
MONGO_URI=mongodb://localhost:27017/social-media
JWT_SECRET=your_super_secret_jwt_key_please_change_in_production
PORT=5000
NODE_ENV=development
```

## Future Enhancements

- 🔍 Search functionality
- 🏷️ Hashtags support
- 📸 Image upload directly
- 🔔 Real-time notifications
- 💬 Direct messaging
- 📊 User statistics & analytics
- 🌙 Dark mode theme
- 📱 Mobile app version

## Security Considerations

⚠️ **Important**: This is a learning project. For production use:
- Change JWT_SECRET in environment variables
- Use HTTPS
- Implement rate limiting
- Add input validation & sanitization
- Use environment-specific configurations
- Implement CSRF protection
- Add comprehensive error handling
- Enable CORS properly with specific origins

## Contributing

Feel free to fork and contribute improvements!

## License

MIT License - feel free to use this project for learning and personal projects.
