import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import { serve } from 'inngest/express'
import { inngest, functions } from './inngest/index.js';
import showRouter from './routes/showRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import userRouter from './routes/userRoutes.js';
import authRouter from './routes/authRoutes.js';

const app = express();
const PORT = 5000;

await connectDB() 
//Middlewares
app.use(express.json())
app.use(cors())
// Auth: Clerk removed; public APIs by default. If you enable JWT later, add a verify middleware here.



//API Routes
app.get('/', (req, res) => res.send('Server is Live!'))
app.use('/api/inngest', serve({client: inngest, functions}))
app.use('/api/show',showRouter)
app.use('/api/booking', bookingRouter)
app.use('/api/admin', adminRouter)
app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

  