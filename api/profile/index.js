import { pool, cors } from '../_lib/db.js';

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
    const [rows] = await pool.query('SELECT * FROM profile LIMIT 1');

    if (rows.length === 0) {
      // Return default empty profile so frontend doesn't crash
      return res.status(200).json({
        name: '',
        title: '',
        bio: '',
        email: '',
        photo_url: '',
        resume_url: '',
        github_url: '',
        linkedin_url: '',
        twitter_url: '',
        available_for_work: false
      });
    }

    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error('Profile fetch error:', err);
    return res.status(500).json({ error: 'Database error', details: err.message });
  }
}
