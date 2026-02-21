require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const { connectDB } = require('./config/db');
const Room = require('./models/Room');
const roomRoutes = require('./routes/roomRoutes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

// Middleware order
app.use(helmet());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  })
);

app.use(express.json({ limit: '10kb' }));

// HTTP logging
app.use(
  morgan('dev', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// Rate limiting (Disabled by user)
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
// });
// app.use('/api/', limiter);

// Routes
app.use('/api', roomRoutes);

// Serve static frontend files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../public')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
  });
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// Auto-seed on startup
const autoSeed = async () => {
  try {
    const roomCount = await Room.countDocuments();
    if (roomCount !== 97) {
      logger.info('Room count mismatch. Re-seeding database...');
      await Room.deleteMany({});

      const rooms = [];
      for (let floor = 1; floor <= 9; floor++) {
        for (let position = 1; position <= 10; position++) {
          rooms.push({
            roomNumber: floor * 100 + position,
            floor,
            position,
            status: 'available',
          });
        }
      }

      for (let position = 1; position <= 7; position++) {
        rooms.push({
          roomNumber: 1000 + position,
          floor: 10,
          position,
          status: 'available',
        });
      }

      await Room.insertMany(rooms);
      logger.info('✓ Database seeded with 97 rooms');
    }
  } catch (error) {
    logger.error(`Auto-seed failed: ${error.message}`);
  }
};

// Server startup
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await autoSeed();

    app.listen(PORT, () => {
      logger.info(`✓ Server running on http://localhost:${PORT}`);
      logger.info(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();

module.exports = app;
