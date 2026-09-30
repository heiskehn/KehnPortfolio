import { getDb, cors } from '../_lib/db.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    cors(res);
    return res.status(200).end();
  }

  cors(res);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const db = getDb();
    const [rows] = await db.query('SELECT * FROM profile LIMIT 1');

    if (rows.length === 0) {
      return res.status(200).json({
        profile: {
          name: '', title: '', bio: '', email: '',
          photo_url: '', resume_url: '',
          github_url: '', linkedin_url: '', twitter_url: '',
          available: true,
        }
      });
    }

    return res.status(200).json({ profile: rows[0] });

  } catch (err) {
    console.error('GET /api/profile error:', err);
    return res.status(500).json({ error: 'Failed to fetch profile', detail: err.message });
  }
}
