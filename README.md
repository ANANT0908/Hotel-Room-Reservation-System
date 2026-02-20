# Hotel Room Reservation System

A production-grade Hotel Room Reservation System built with the MERN stack (MongoDB, Express, React, Node.js). Intelligently assigns rooms to minimize guest travel time using an advanced optimization algorithm.

## Features

✨ **Key Features**
- Manage 97 hotel rooms across 10 floors with live floor-plan visualization
- Intelligent room assignment algorithm (Auto Book) that minimizes travel time
- **New**: Restricted manual selection - enforce 1-5 rooms limit in real-time
- **New**: Real-time travel estimation for manual room selection
- Booking history with travel time metrics
- Random occupancy simulation for realistic testing
- One-click reset for all rooms
- Persistent booking records in MongoDB
- Auto-seeding database on first run

## Quick Start

### Prerequisites
- Node.js ≥ 18
- MongoDB 7.x (local or cloud)

### Installation

```bash
# Backend setup
cd backend
cp .env.example .env
npm install
npm run dev

# Frontend setup (new terminal)
cd frontend
cp .env.example .env
npm install
npm run dev
```

Backend: http://localhost:5000  
Frontend: http://localhost:5173

## Tech Stack

React 18 · Vite 5 · Node.js · Express 4 · MongoDB 7 · Mongoose 8

## Room System

- **Floors 1-9**: 10 rooms each (101-110, 201-210, ..., 901-910)
- **Floor 10**: 7 rooms (1001-1007)
- **Total**: 97 rooms

## Booking Rules

1. **Limit**: A single guest can book up to 5 rooms at a time.
2. **Priority**: Same-floor booking is prioritized to keep groups together.
3. **Minimized Travel**: If split across floors, the algorithm minimizes the maximum travel time between any two rooms.
4. **Distance Formula**: 
   - Same Floor: `|pos1 - pos2|` minutes.
   - Cross-Floor: `(pos1 - 1) + 2 * |floor1 - floor2| + (pos2 - 1)` minutes (via lift at position 1).

## API Endpoints

```
GET    /api/rooms          Get all rooms and stats
POST   /api/rooms/book     Book rooms
POST   /api/rooms/random   Simulate occupancy
POST   /api/rooms/reset    Reset all rooms
GET    /api/bookings       Booking history
GET    /health             Health check
```

## Testing

```bash
cd backend && npm test
```

## License

MIT
