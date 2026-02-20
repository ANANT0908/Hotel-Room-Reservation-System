const { validationResult } = require('express-validator');
const roomService = require('../services/roomService');
const logger = require('../utils/logger');

exports.getRooms = async (req, res, next) => {
  try {
    const [rooms, stats] = await Promise.all([roomService.getAllRooms(), roomService.getStats()]);

    res.status(200).json({
      success: true,
      rooms,
      stats,
    });
  } catch (error) {
    logger.error(`GET /api/rooms error: ${error.message}`);
    next(error);
  }
};

exports.bookRooms = async (req, res, next) => {
  try {
    // Validate
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { count } = req.body;
    const booking = await roomService.bookRooms(count);

    res.status(201).json({
      success: true,
      booking,
    });
  } catch (error) {
    logger.error(`POST /api/rooms/book error: ${error.message}`);
    next(error);
  }
};

exports.randomOccupancy = async (req, res, next) => {
  try {
    const result = await roomService.randomOccupancy();

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    logger.error(`POST /api/rooms/random error: ${error.message}`);
    next(error);
  }
};

exports.resetAll = async (req, res, next) => {
  try {
    await roomService.resetAll();

    res.status(200).json({
      success: true,
      message: 'All rooms reset successfully',
    });
  } catch (error) {
    logger.error(`POST /api/rooms/reset error: ${error.message}`);
    next(error);
  }
};

exports.getBookings = async (req, res, next) => {
  try {
    const bookings = await roomService.getBookings();

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    logger.error(`GET /api/bookings error: ${error.message}`);
    next(error);
  }
};
