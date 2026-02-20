const { v4: uuidv4 } = require('uuid');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const { findOptimalRooms } = require('./bookingAlgorithm');
const logger = require('../utils/logger');

class RoomService {
  async getAllRooms() {
    try {
      const rooms = await Room.find({})
        .lean()
        .sort({ floor: -1, position: 1 });
      return rooms;
    } catch (error) {
      logger.error(`Error fetching rooms: ${error.message}`);
      throw error;
    }
  }

  async getStats() {
    try {
      const [available, occupied, booked, total] = await Promise.all([
        Room.countDocuments({ status: 'available' }),
        Room.countDocuments({ status: 'occupied' }),
        Room.countDocuments({ status: 'booked' }),
        Room.countDocuments({}),
      ]);

      return { available, occupied, booked, total };
    } catch (error) {
      logger.error(`Error fetching stats: ${error.message}`);
      throw error;
    }
  }

  async bookRooms(count) {
    try {
      // Fetch all available rooms
      const availableRooms = await Room.findAvailable();

      if (availableRooms.length < count) {
        const error = new Error(
          `Cannot book ${count} rooms. Only ${availableRooms.length} room(s) available.`
        );
        error.statusCode = 409;
        throw error;
      }

      // Run algorithm
      const result = findOptimalRooms(availableRooms, count);

      if (!result) {
        const error = new Error(
          `Cannot book ${count} rooms. Only ${availableRooms.length} room(s) available.`
        );
        error.statusCode = 409;
        throw error;
      }

      // Generate booking ID
      const bookingId = uuidv4();

      // Extract room numbers and floors
      const roomNumbers = result.rooms.map((r) => r.roomNumber);
      const floorsSpanned = [...new Set(result.rooms.map((r) => r.floor))].sort((a, b) => a - b);

      // Update room statuses atomically
      await Room.bulkUpdateStatus(roomNumbers, 'booked', bookingId);

      // Create booking record
      const booking = await Booking.create({
        bookingId,
        rooms: result.rooms,
        roomCount: count,
        travelTime: result.travelTime,
        floorsSpanned,
      });

      // Return DTO
      return {
        bookingId,
        rooms: roomNumbers,
        travelTime: result.travelTime,
        floorsSpanned,
        floorLabel: booking.floorLabel,
        createdAt: booking.createdAt,
      };
    } catch (error) {
      logger.error(`Error booking rooms: ${error.message}`);
      throw error;
    }
  }

  async randomOccupancy() {
    try {
      // Clear old occupied rooms
      await Room.updateMany({ status: 'occupied' }, { status: 'available' });

      // Fetch all currently available
      const availableRooms = await Room.findAvailable();

      // Fisher-Yates shuffle
      const shuffled = [...availableRooms];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      // Mark random subset as occupied
      const occupiedCount = Math.floor(shuffled.length * (0.25 + Math.random() * 0.2));
      const occupiedRooms = shuffled.slice(0, occupiedCount);
      const occupiedNumbers = occupiedRooms.map((r) => r.roomNumber);

      // Update database
      await Room.bulkUpdateStatus(occupiedNumbers, 'occupied');

      return {
        occupiedCount,
        occupiedRooms: occupiedNumbers,
      };
    } catch (error) {
      logger.error(`Error setting random occupancy: ${error.message}`);
      throw error;
    }
  }

  async resetAll() {
    try {
      // Set all rooms to available
      await Room.updateMany({}, { status: 'available', bookingId: null, bookedAt: null });

      // Cancel all active bookings
      await Booking.updateMany({ status: 'active' }, { status: 'cancelled' });

      logger.info('All rooms reset successfully');
      return { message: 'All rooms reset successfully' };
    } catch (error) {
      logger.error(`Error resetting rooms: ${error.message}`);
      throw error;
    }
  }

  async getBookings() {
    try {
      const bookings = await Booking.find({ status: 'active' })
        .lean()
        .sort({ createdAt: -1 })
        .limit(50);

      return bookings;
    } catch (error) {
      logger.error(`Error fetching bookings: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new RoomService();
