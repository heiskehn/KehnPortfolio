import jwt from 'jsonwebtoken';

export function verifyAuth(req) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) throw new Error('No token');
  return jwt.verify(token, process.env.JWT_SECRET);
}
