require('dotenv').config();
const mongoose = require('mongoose');
const Room = require('../models/Room');
const logger = require('../utils/logger');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel_reservation', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info('Connected to MongoDB');

    // Delete existing rooms
    await Room.deleteMany({});
    logger.info('Cleared existing rooms');

    // Generate 97 rooms
    const rooms = [];

    // Floors 1-9: 10 rooms each
    for (let floor = 1; floor <= 9; floor++) {
      for (let position = 1; position <= 10; position++) {
        const roomNumber = floor * 100 + position;
        rooms.push({
          roomNumber,
          floor,
          position,
          status: 'available',
        });
      }
    }

    // Floor 10: 7 rooms
    for (let position = 1; position <= 7; position++) {
      const roomNumber = 1000 + position;
      rooms.push({
        roomNumber,
        floor: 10,
        position,
        status: 'available',
      });
    }

    // Insert all rooms
    await Room.insertMany(rooms);
    logger.info(`✓ Seeded ${rooms.length} rooms successfully`);

    await mongoose.connection.close();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
