const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    rooms: [
      {
        roomNumber: Number,
        floor: Number,
        position: Number,
      },
    ],
    roomCount: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    travelTime: {
      type: Number,
      required: true,
      min: 0,
    },
    floorsSpanned: [Number],
    status: {
      type: String,
      enum: ['active', 'cancelled'],
      default: 'active',
    },
  },
  { timestamps: true }
);

// Virtual for floor label
BookingSchema.virtual('floorLabel').get(function () {
  if (this.floorsSpanned.length === 1) {
    return `Floor ${this.floorsSpanned[0]}`;
  }
  return `Floors ${this.floorsSpanned.join(', ')}`;
});

// Ensure virtuals are included in JSON
BookingSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Booking', BookingSchema);
