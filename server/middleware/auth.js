import jwt from 'jsonwebtoken'

// Simple JWT protect middleware (optional). If no token, request proceeds (public API). 
// You can enforce by checking and returning 401 instead.
export const protect = (req, _res, next) => {
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret')
      req.userId = payload.id
    } catch (e) {
      // ignore invalid tokens
    }
  }
  next()
}

// Admin protection disabled as per requirement
export const protectAdmin = (_req, _res, next) => next()