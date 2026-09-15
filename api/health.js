import { cors } from './_lib/db.js';

export default function handler(req, res) {
  cors(res);
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
}
