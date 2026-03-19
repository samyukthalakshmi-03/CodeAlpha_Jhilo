# Quick Start Guide - SocialHub

## 🚀 Fastest Way: Using Docker

1. **Install Docker Desktop** (if not already installed)
   - Download from: https://www.docker.com/products/docker-desktop

2. **Run the application**
   ```bash
   cd C:\Users\Samyuktha\OneDrive\Documents\Jhilo
   docker-compose up
   ```

3. **Open in browser**
   - Visit: http://localhost

4. **Create test accounts**
   - Sign up with any username, email, and password
   - Create multiple accounts to test follow/like system

## 🛠️ Manual Setup (If Docker is not available)

### Prerequisites
- Node.js v18+ (Download from https://nodejs.org/)
- MongoDB Community Edition (Download from https://www.mongodb.com/try/download/community)
- Start MongoDB before running the backend

### Steps

1. **Backend Setup**
   ```bash
   cd server
   npm install
   npm start
   ```
   Backend will run on http://localhost:5000

2. **Frontend Setup** (in a new terminal)
   ```bash
   cd client
   
   # Option A: Using Python (built-in on most systems)
   python -m http.server 3000
   
   # Option B: Using Node.js http-server
   npx http-server -p 3000
   
   # Option C: Using Node.js live-server
   npx live-server --port=3000
   ```
   Frontend will run on http://localhost:3000

3. **Update API URL** (if using manual setup)
   - Open `client/app.js`
   - Change `API_BASE_URL` to match your backend URL

## 📝 Test Account Credentials

After setup, you can test with these credentials or create your own:

**Account 1:**
- Email: user1@example.com
- Password: password123
- Username: user1

**Account 2:**
- Email: user2@example.com
- Password: password123
- Username: user2

(Create these by signing up if they don't exist)

## 🎯 Features to Test

1. **Authentication**
   - Register new account
   - Login with credentials
   - See profile information

2. **Posts**
   - Create a new post
   - View feeds from all users
   - Like/Unlike posts
   - Delete your own posts

3. **Comments**
   - Click on a post to see comments
   - Add comments to posts
   - Like comments

4. **Following System**
   - Go to Explore page
   - Follow/Unfollow users
   - See follower counts on profile

5. **Profile Management**
   - Edit bio
   - Change avatar (enter image URL)
   - View your posts

## 🐛 Troubleshooting

### "Port 5000 already in use"
```bash
# Kill the process on Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process
```

### "Cannot connect to MongoDB"
- Ensure MongoDB is running
- Check MONGO_URI in .env file
- For Docker: MongoDB container should start automatically

### "CORS errors"
- Ensure backend is http://localhost:5000
- Frontend should be http://localhost or http://localhost:3000
- Check that API_BASE_URL in app.js matches your backend URL

### "Files not found when running locally"
- Make sure you're in the correct directory
- Use absolute paths or proper relative paths
- Check that all files exist in client/ and server/ folders

## 📚 Useful Commands

```bash
# Start Docker containers
docker-compose up

# Stop Docker containers (Ctrl+C)
# Or command: docker-compose down

# View Docker logs
docker-compose logs -f backend

# Remove all containers
docker-compose down -v

# Access MongoDB shell (when running)
docker exec -it social-media-mongo mongosh

# Check if ports are in use (Windows)
netstat -ano | findstr :5000
```

## 🎓 Learning Resources

- Express.js: https://expressjs.com/
- MongoDB: https://docs.mongodb.com/
- JWT: https://jwt.io/
- REST API: https://restfulapi.net/
- Docker: https://docs.docker.com/

## 📞 Need Help?

Check the README.md for detailed API documentation and feature descriptions.
