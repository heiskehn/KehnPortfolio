import { getDb, parseTechStack, cors } from '../_lib/db.js';
import { verifyAuth } from '../_lib/auth.js';
import slugify from 'slugify';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    verifyAuth(req);
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const {
      title, description, long_description,
      tech_stack, image_url, live_url, github_url,
      featured, order_index,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const db = getDb();

    let slug = slugify(title, { lower: true, strict: true });
    const [existing] = await db.query('SELECT id FROM projects WHERE slug = ?', [slug]);
    if (existing.length) slug = `${slug}-${Date.now()}`;

    const techArray = parseTechStack(tech_stack);
    const isFeatured = featured === true || featured === 'true' || featured === 1 ? 1 : 0;
    const orderIdx = parseInt(order_index) || 0;

    const [result] = await db.query(
      `INSERT INTO projects
        (slug, title, description, long_description, tech_stack, image, live_url, github_url, featured, order_index)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        slug, title, description,
        long_description || null,
        JSON.stringify(techArray),
        image_url || null,     // On Vercel: pass a hosted image URL (Cloudinary, etc.)
        live_url || null,
        github_url || null,
        isFeatured,
        orderIdx,
      ]
    );

    const [rows] = await db.query('SELECT * FROM projects WHERE id = ?', [result.insertId]);
    const project = { ...rows[0], tech_stack: parseTechStack(rows[0].tech_stack) };
    return res.status(201).json({ project });
  } catch (err) {
    console.error('POST /api/projects/create error:', err);
    return res.status(500).json({ error: 'Failed to create project', detail: err.message });
  }
}
