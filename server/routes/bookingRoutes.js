import express from 'express';
import { createBooking, getOccupiedSeats, markBookingPaid } from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';


const bookingRouter = express.Router();

bookingRouter.post('/create', protect, createBooking);
bookingRouter.get('/seats/:showId', getOccupiedSeats);
bookingRouter.post('/pay/:bookingId', protect, markBookingPaid);

export default bookingRouter;