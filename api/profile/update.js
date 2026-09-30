import { pool, cors } from '../_lib/db.js';
import { verifyAuth } from '../_lib/auth.js';

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    cors(res);
    return res.status(200).end();
  }

  cors(res);

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    verifyAuth(req, res);
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const {
      name,
      title,
      bio,
      email,
      photo_url,
      resume_url,
      github_url,
      linkedin_url,
      twitter_url,
      available_for_work
    } = req.body;

    const [rows] = await pool.query('SELECT id FROM profile LIMIT 1');

    if (rows.length === 0) {
      // Insert new profile row
      await pool.query(
        `INSERT INTO profile
          (name, title, bio, email, photo_url, resume_url, github_url, linkedin_url, twitter_url, available_for_work)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, title, bio, email, photo_url, resume_url, github_url, linkedin_url, twitter_url, available_for_work ? 1 : 0]
      );
    } else {
      // Update existing
      await pool.query(
        `UPDATE profile SET
          name = ?,
          title = ?,
          bio = ?,
          email = ?,
          photo_url = ?,
          resume_url = ?,
          github_url = ?,
          linkedin_url = ?,
          twitter_url = ?,
          available_for_work = ?
        WHERE id = ?`,
        [name, title, bio, email, photo_url, resume_url, github_url, linkedin_url, twitter_url, available_for_work ? 1 : 0, rows[0].id]
      );
    }

    const [updated] = await pool.query('SELECT * FROM profile LIMIT 1');
    return res.status(200).json({ success: true, profile: updated[0] });

  } catch (err) {
    console.error('Profile update error:', err);
    return res.status(500).json({ error: 'Database error', details: err.message });
  }
}
