import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import { serve } from 'inngest/express'
import { inngest, functions } from './inngest/index.js';
import showRouter from './routes/showRoutes.js';

const app = express();
const PORT = 5000;

await connectDB() 
//Middlewares
app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())



//API Routes
app.get('/', (req, res) => res.send('Server is Live!'))
app.use('/api/inngest', serve({client: inngest, functions}))
app.use('/api/show',showRouter)
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

 