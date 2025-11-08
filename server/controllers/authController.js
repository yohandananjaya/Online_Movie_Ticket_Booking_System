import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if(!name || !email || !password){
      return res.status(400).json({success:false, message:'Missing fields'})
    }
    const existing = await User.findOne({email})
    if(existing){
      return res.json({success:false, message:'Email already registered'})
    }
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, passwordHash })
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' })
    res.json({success:true, user:{id:user._id, name:user.name, email:user.email}, token})
  } catch (e) {
    console.error(e)
    res.json({success:false, message:'Registration failed'})
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({email})
    if(!user){
      return res.json({success:false, message:'Invalid credentials'})
    }
    const ok = await bcrypt.compare(password, user.passwordHash)
    if(!ok){
      return res.json({success:false, message:'Invalid credentials'})
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' })
    res.json({success:true, user:{id:user._id, name:user.name, email:user.email}, token})
  } catch (e) {
    console.error(e)
    res.json({success:false, message:'Login failed'})
  }
}
