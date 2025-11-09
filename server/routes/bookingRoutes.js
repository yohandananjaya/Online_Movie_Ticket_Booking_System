import express from 'express';
import { createBooking, getOccupiedSeats, markBookingPaid } from '../controllers/bookingController.js';
import { requireAuth } from '../middleware/auth.js';


const bookingRouter = express.Router();

bookingRouter.post('/create', requireAuth, createBooking);
bookingRouter.get('/seats/:showId', getOccupiedSeats);
bookingRouter.post('/pay/:bookingId', requireAuth, markBookingPaid);

export default bookingRouter;