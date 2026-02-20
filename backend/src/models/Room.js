const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    floor: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
      index: true,
    },
    position: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    status: {
      type: String,
      enum: ['available', 'occupied', 'booked'],
      default: 'available',
      index: true,
    },
    bookingId: {
      type: String,
      default: null,
      index: true,
    },
    bookedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Statics
RoomSchema.statics.findAvailable = function () {
  return this.find({ status: 'available' })
    .lean()
    .sort({ floor: 1, position: 1 });
};

RoomSchema.statics.findByBookingId = function (bookingId) {
  return this.find({ bookingId });
};

RoomSchema.statics.bulkUpdateStatus = async function (roomNumbers, status, bookingId = null) {
  return this.updateMany(
    { roomNumber: { $in: roomNumbers } },
    {
      status,
      bookingId,
      bookedAt: status === 'booked' ? new Date() : null,
    }
  );
};

module.exports = mongoose.model('Room', RoomSchema);
