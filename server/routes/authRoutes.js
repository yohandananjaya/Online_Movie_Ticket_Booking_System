import express from 'express'
import { currentUser, login, register } from '../controllers/authController.js'
import { requireAuth } from '../middleware/auth.js'

const authRouter = express.Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.get('/me', requireAuth, currentUser)

export default authRouter
