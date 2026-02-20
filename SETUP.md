# Setup Guide

Complete setup instructions for developing the Hotel Room Reservation System locally.

## Prerequisites

- **Node.js**: v18.0.0 or higher ([download](https://nodejs.org/))
- **npm**: v9.0.0 or higher (comes with Node.js)
- **MongoDB**: v7.0 or higher
  - Local: [MongoDB Community Server](https://www.mongodb.com/try/download/community)
  - Cloud: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)

## Step 1: Verify Installation

```bash
node --version    # Should be v18+
npm --version     # Should be v9+
```

## Step 2: MongoDB Setup

### Option A: Local MongoDB

```bash
# macOS (with Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Windows (with Chocolatey)
choco install mongodb

# Linux (Ubuntu)
sudo apt-get install -y mongodb
sudo systemctl start mongod
```

Verify: Open MongoDB shell
```bash
mongosh
# Should connect to mongodb://localhost:27017
```

### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a new cluster
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/hotel_reservation`
5. Add your IP to whitelist

## Step 3: Backend Setup

```bash
cd Hotel-Room-Reservation-System/backend

# Copy environment file
cp .env.example .env

# Edit .env with your MongoDB URI
# For local: MONGODB_URI=mongodb://localhost:27017/hotel_reservation
# For Atlas: MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/hotel_reservation

# Install dependencies
npm install

# Start development server
npm run dev
```

**Output should show:**
```
✓ Database connected
✓ Server running on http://localhost:5000
✓ 97 rooms seeded automatically
```

### Available Backend Scripts

```bash
npm run dev          # Development server with auto-reload (nodemon)
npm start            # Production server
npm test             # Run tests with coverage
npm run test:watch   # Watch mode for tests
npm run lint         # Run ESLint
npm run seed         # Manually seed database
```

## Step 4: Frontend Setup

In a **new terminal**:

```bash
cd Hotel-Room-Reservation-System/frontend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev
```

**Output should show:**
```
✓ Local:   http://localhost:5173/
✓ Press q to quit
```

### Available Frontend Scripts

```bash
npm run dev          # Development server
npm run build        # Production build (outputs to dist/)
npm run preview      # Preview production build
```

## Step 5: Access Application

Open http://localhost:5173 in your browser.

You should see:
- ✓ 97 hotel rooms in a grid layout
- ✓ Floor plan from Floor 10 (top) to Floor 1 (bottom) with lift visualization
- ✓ Live stats (Available, Occupied, Booked, Total)
- ✓ **Auto Book**: Click to let the system find the best rooms (max 5)
- ✓ **Manual Selection**: Click rooms to select (max 5), shows real-time travel estimate
- ✓ Booking history on the right sidebar

## Troubleshooting

### MongoDB Connection Fails

**Error**: `MongoServerError: connect ECONNREFUSED 127.0.0.1:27017`

**Solution**:
```bash
# Check MongoDB is running
# Local: mongosh (should connect)
# Cloud: Verify MONGODB_URI in .env is correct
```

### Port Already in Use

**Error**: `Error: listen EADDRINUSE :::5000`

**Solution**:
```bash
# Change port in backend/.env
PORT=5001

# Or kill process using port
# macOS/Linux
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Frontend Can't Connect to Backend

**Error**: `Network Error` or CORS errors

**Solution**:
1. Verify backend is running: http://localhost:5000/health
2. Check `.env` has correct `VITE_API_URL`
3. Clear browser cache (Ctrl+Shift+Delete)
4. Check browser console for specific errors

### Database Auto-Seed Doesn't Work

**Solution**:
```bash
# Manually seed
cd backend
npm run seed

# Or delete database and restart
# MongoDB: use hotel_reservation; db.rooms.deleteMany({})
```

## Development Workflow

### Running Both Servers

1. **Terminal 1 - Backend**
   ```bash
   cd backend
   npm run dev
   ```

2. **Terminal 2 - Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

3. Open browser to http://localhost:5173

### Hot Reload

- **Backend**: Auto-reloads on file changes (nodemon)
- **Frontend**: Auto-reloads on file changes (Vite HMR)

### Database Inspection

```bash
# MongoDB shell
mongosh

# View database
use hotel_reservation

# Collections
db.rooms.count()      # Should be 97
db.bookings.find()    # View bookings

# Reset database
db.rooms.deleteMany({})
db.bookings.deleteMany({})
```

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm test -- --coverage
```

### Manual API Testing with cURL

```bash
# Get all rooms
curl http://localhost:5000/api/rooms

# Book 3 rooms (Auto)
curl -X POST http://localhost:5000/api/rooms/book \
  -H "Content-Type: application/json" \
  -d '{"count": 3, "mode": "optimal"}'

# Book specific rooms (Manual selection)
curl -X POST http://localhost:5000/api/rooms/book-selected \
  -H "Content-Type: application/json" \
  -d '{"roomNumbers": [101, 102]}'

# Get bookings
curl http://localhost:5000/api/bookings

# Reset rooms
curl -X POST http://localhost:5000/api/rooms/reset

# Health check
curl http://localhost:5000/health
```

## IDE Setup (VS Code)

### Recommended Extensions

- ES7+ React/Redux/React-Native snippets
- MongoDB for VS Code
- Thunder Client (or Postman) for API testing
- Prettier - Code formatter
- ESLint

### Settings

Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Production Deployment

### Backend (Railway or Render)

1. Push code to GitHub
2. Connect to Railway/Render
3. Set environment variables:
   ```
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://...
   CORS_ORIGIN=https://your-frontend-domain.com
   ```
4. Deploy

### Frontend (Vercel)

1. Push code to GitHub
2. Connect to Vercel
3. Set environment variables:
   ```
   VITE_API_URL=https://your-backend-domain.com/api
   ```
4. Deploy

## Performance Tuning

### Backend
- MongoDB indexes are auto-created
- Connection pooling configured
- Rate limiting: 100 requests per 15 minutes
- Response caching: Consider for /api/rooms

### Frontend
- Lazy loading of components
- Memoization of HotelGrid and RoomCell
- Debounced API calls
- Optimized re-renders

## Environment Variables Reference

### Backend (.env)

```bash
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/hotel_reservation

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000      # 15 minutes
RATE_LIMIT_MAX=100               # 100 requests per window

# Logging
LOG_LEVEL=debug
```

### Frontend (.env)

```bash
# API
VITE_API_URL=http://localhost:5000/api
```

## Debugging

### Backend Debug Mode

```bash
# With Node inspector
node --inspect src/app.js

# Then open chrome://inspect in Chrome
```

### Frontend Debug Mode

```console
// In browser console
localStorage.setItem('DEBUG', 'hotel-*')
```

### Database Debug

Add `{ debug: true }` to Mongoose connection in `config/db.js`.

## Getting Help

1. Check logs: `backend/*.log` and browser console
2. Verify prerequisites are installed
3. Ensure all .env files are configured
4. Check MongoDB connection
5. Try steps in "Troubleshooting" section
6. Review README.md for architecture overview

## Next Steps

1. ✓ Run both servers locally
2. ✓ Test booking functionality
3. ✓ Review API endpoints at http://localhost:5000/api
4. ✓ Explore code structure
5. ✓ Run tests to verify setup
6. ✓ Deploy to production

---

Happy coding! 🚀
