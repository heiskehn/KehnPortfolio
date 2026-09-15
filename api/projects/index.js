import { getDb, parseTechStack, cors } from '../_lib/db.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const db = getDb();
    const [rows] = await db.query(
      'SELECT * FROM projects ORDER BY featured DESC, order_index ASC, created_at DESC'
    );
    const projects = rows.map(p => ({
      ...p,
      tech_stack: parseTechStack(p.tech_stack),
    }));
    return res.status(200).json({ projects });
  } catch (err) {
    console.error('GET /api/projects error:', err);
    return res.status(500).json({ error: 'Failed to fetch projects', detail: err.message });
  }
}
