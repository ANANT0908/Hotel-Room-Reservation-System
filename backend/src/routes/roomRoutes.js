const router = require('express').Router();
const roomController = require('../controllers/roomController');
const { validateBooking } = require('../middleware/validate');

router.get('/rooms', roomController.getRooms);
router.post('/rooms/book', validateBooking, roomController.bookRooms);
router.post('/rooms/random', roomController.randomOccupancy);
router.post('/rooms/reset', roomController.resetAll);
router.get('/bookings', roomController.getBookings);
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  });
});

module.exports = router;
