import { cors } from '../_lib/db.js';
import { verifyAuth } from '../_lib/auth.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const user = verifyAuth(req);
    return res.status(200).json({ valid: true, user });
  } catch {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}
