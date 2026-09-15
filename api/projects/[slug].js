import { getDb, parseTechStack, cors } from '../../_lib/db.js';
import { verifyAuth } from '../../_lib/auth.js';
import slugify from 'slugify';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { slug } = req.query;
  const db = getDb();

  // ── GET /api/projects/[slug] — public ──────────────────────────
  if (req.method === 'GET') {
    try {
      const [rows] = await db.query('SELECT * FROM projects WHERE slug = ?', [slug]);
      if (!rows.length) return res.status(404).json({ error: 'Project not found' });
      const project = { ...rows[0], tech_stack: parseTechStack(rows[0].tech_stack) };
      return res.status(200).json({ project });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch project', detail: err.message });
    }
  }

  // ── PUT /api/projects/[id] — admin only ────────────────────────
  if (req.method === 'PUT') {
    try { verifyAuth(req); } catch { return res.status(401).json({ error: 'Unauthorized' }); }

    try {
      const [existing] = await db.query('SELECT * FROM projects WHERE id = ?', [slug]);
      if (!existing.length) return res.status(404).json({ error: 'Project not found' });

      const current = existing[0];
      const {
        title, description, long_description,
        tech_stack, image_url, live_url, github_url,
        featured, order_index,
      } = req.body;

      const techArray = tech_stack
        ? parseTechStack(tech_stack)
        : parseTechStack(current.tech_stack);

      const isFeatured = featured !== undefined
        ? (featured === true || featured === 'true' || featured === 1 ? 1 : 0)
        : current.featured;

      await db.query(
        `UPDATE projects SET
          title = ?, description = ?, long_description = ?, tech_stack = ?,
          image = ?, live_url = ?, github_url = ?, featured = ?, order_index = ?
         WHERE id = ?`,
        [
          title || current.title,
          description || current.description,
          long_description !== undefined ? (long_description || null) : current.long_description,
          JSON.stringify(techArray),
          image_url !== undefined ? (image_url || null) : current.image,
          live_url !== undefined ? (live_url || null) : current.live_url,
          github_url !== undefined ? (github_url || null) : current.github_url,
          isFeatured,
          order_index !== undefined ? (parseInt(order_index) || 0) : current.order_index,
          slug,
        ]
      );

      const [updated] = await db.query('SELECT * FROM projects WHERE id = ?', [slug]);
      const project = { ...updated[0], tech_stack: parseTechStack(updated[0].tech_stack) };
      return res.status(200).json({ project });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update project', detail: err.message });
    }
  }

  // ── DELETE /api/projects/[id] — admin only ─────────────────────
  if (req.method === 'DELETE') {
    try { verifyAuth(req); } catch { return res.status(401).json({ error: 'Unauthorized' }); }

    try {
      const [rows] = await db.query('SELECT id FROM projects WHERE id = ?', [slug]);
      if (!rows.length) return res.status(404).json({ error: 'Project not found' });

      await db.query('DELETE FROM projects WHERE id = ?', [slug]);
      return res.status(200).json({ message: 'Project deleted successfully' });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to delete project', detail: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
