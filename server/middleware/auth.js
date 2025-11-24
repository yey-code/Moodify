import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.SESSION_SECRET || 'your-secret-key-change-this';

export function authenticateUser(req, res, next) {
  let userId = null;
  
  // Try JWT from Authorization header first
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.userId;
    } catch (error) {
      console.log('JWT verification failed:', error.message);
    }
  }
  
  // Fall back to cookie
  if (!userId) {
    userId = req.cookies.userId;
  }
  
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  req.userId = userId;
  next();
}
