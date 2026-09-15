import mysql from 'mysql2/promise';

let pool = null;

export function getDb() {
  if (pool) return pool;

  const url = new URL(process.env.MYSQL_URL);

  pool = mysql.createPool({
    host: url.hostname,
    port: parseInt(url.port),
    user: url.username,
    password: url.password,
    database: url.pathname.replace('/', ''),
    ssl: { rejectUnauthorized: false },
    authPlugins: {
      mysql_native_password: () => () => Buffer.from(url.password + '\0'),
      caching_sha2_password: () => () => Buffer.from(url.password + '\0'),
    },
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
  });

  return pool;
}

export function parseTechStack(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return value.split(',').map(s => s.trim()).filter(Boolean);
  }
}

export function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}
