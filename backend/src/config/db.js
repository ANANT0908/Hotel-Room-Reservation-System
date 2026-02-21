const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel_reservation';

    const connection = await mongoose.connect(mongoURI);

    logger.info(`✓ Database connected: ${connection.connection.host}:${connection.connection.port}`);

    // Reconnection events
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB connection lost');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('✓ MongoDB reconnected');
    });

    return connection;
  } catch (error) {
    logger.error(`✗ Database connection failed!`);
    logger.error(`Error name: ${error.name}`);
    logger.error(`Error message: ${error.message}`);
    if (error.reason) logger.error(`Reason: ${error.reason}`);
    throw error;
  }
};

module.exports = { connectDB };
