import { getDb, cors } from '../_lib/db.js';
import { verifyAuth } from '../_lib/auth.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    cors(res);
    return res.status(200).end();
  }

  cors(res);

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    verifyAuth(req);
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const {
      name, title, bio, email,
      photo_url, resume_url,
      github_url, linkedin_url, twitter_url,
      available,
    } = req.body;

    const db = getDb();
    const [rows] = await db.query('SELECT id FROM profile LIMIT 1');

    if (rows.length === 0) {
      await db.query(
        `INSERT INTO profile
          (name, title, bio, email, photo_url, resume_url, github_url, linkedin_url, twitter_url, available)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, title, bio, email, photo_url, resume_url, github_url, linkedin_url, twitter_url, available ? 1 : 0]
      );
    } else {
      await db.query(
        `UPDATE profile SET
          name = ?, title = ?, bio = ?, email = ?,
          photo_url = ?, resume_url = ?,
          github_url = ?, linkedin_url = ?, twitter_url = ?,
          available = ?
        WHERE id = ?`,
        [name, title, bio, email, photo_url, resume_url, github_url, linkedin_url, twitter_url, available ? 1 : 0, rows[0].id]
      );
    }

    const [updated] = await db.query('SELECT * FROM profile LIMIT 1');
    return res.status(200).json({ success: true, profile: updated[0] });

  } catch (err) {
    console.error('Profile update error:', err);
    return res.status(500).json({ error: 'Database error', details: err.message });
  }
}
