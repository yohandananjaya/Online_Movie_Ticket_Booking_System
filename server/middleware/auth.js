import jwt from 'jsonwebtoken'

// Lenient middleware (kept for public endpoints where userId is optional)
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

// Strict auth required middleware – rejects if missing/invalid
export const requireAuth = (req, res, next) => {
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required' })
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret')
    req.userId = payload.id
    next()
  } catch (e) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' })
  }
}

// Admin protection placeholder (expand with role checks later)
export const protectAdmin = (_req, _res, next) => next()