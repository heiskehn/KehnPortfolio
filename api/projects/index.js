import { getDb, cors } from '../_lib/db.js';

export default async function handler(req, res) {
  cors(res);
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const db = getDb();
    const [rows] = await db.query('SELECT * FROM projects ORDER BY order_index ASC, id DESC');

    if (!rows.length) {
      // Return empty defaults if not set yet
      return res.status(200).json({
        profile: {
          name: '',
          title: '',
          bio: '',
          photo_url: '',
          resume_url: '',
          email: '',
          github_url: '',
          linkedin_url: '',
          twitter_url: '',
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
