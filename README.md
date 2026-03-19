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




