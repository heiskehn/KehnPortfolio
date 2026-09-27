import { getDb, cors } from '../_lib/db.js';
import { verifyAuth } from '../_lib/auth.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  try {
    verifyAuth(req);
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const {
      name, title, bio, photo_url, resume_url,
      email, github_url, linkedin_url, twitter_url, available,
    } = req.body;

    const db = getDb();
    const [rows] = await db.query('SELECT id FROM profile LIMIT 1');

    if (rows.length) {
      // Update existing
      await db.query(
        `UPDATE profile SET
          name = ?, title = ?, bio = ?, photo_url = ?, resume_url = ?,
          email = ?, github_url = ?, linkedin_url = ?, twitter_url = ?, available = ?
         WHERE id = ?`,
        [
          name || '', title || '', bio || '',
          photo_url || '', resume_url || '', email || '',
          github_url || '', linkedin_url || '', twitter_url || '',
          available !== undefined ? (available ? 1 : 0) : 1,
          rows[0].id,
        ]
      );
    } else {
      // Insert first time
      await db.query(
        `INSERT INTO profile
          (name, title, bio, photo_url, resume_url, email, github_url, linkedin_url, twitter_url, available)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name || '', title || '', bio || '',
          photo_url || '', resume_url || '', email || '',
          github_url || '', linkedin_url || '', twitter_url || '',
          available !== undefined ? (available ? 1 : 0) : 1,
        ]
      );
    }

    const [updated] = await db.query('SELECT * FROM profile LIMIT 1');
    return res.status(200).json({ profile: updated[0] });
  } catch (err) {
    console.error('PUT /api/profile/update error:', err);
    return res.status(500).json({ error: 'Failed to update profile', detail: err.message });
  }
}
