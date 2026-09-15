import 'dotenv/config';
import { createConnection } from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const config = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
};

console.log(`Connecting to ${process.env.DB_HOST}:${process.env.DB_PORT}...`);



const connection = await createConnection(config);
console.log('✅ Connected to database');

await connection.query(`
  CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT,
    tech_stack JSON NOT NULL,
    image VARCHAR(500),
    live_url VARCHAR(500),
    github_url VARCHAR(500),
    featured BOOLEAN DEFAULT FALSE,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`);

await connection.query(`
  CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log('✅ Tables created');

const username = process.env.ADMIN_USERNAME || 'admin';
const password = process.env.ADMIN_PASSWORD || 'admin123';
const hash = await bcrypt.hash(password, 12);

await connection.query(
  'INSERT IGNORE INTO admin_users (username, password_hash) VALUES (?, ?)',
  [username, hash]
);

console.log(`✅ Admin user "${username}" ready`);

const sample = [
  {
    slug: 'nexus-platform',
    title: 'Nexus Platform',
    description: 'A real-time SaaS analytics dashboard processing 1M+ events/day.',
    long_description: 'Built with React and Node.js microservices. Features WebSocket-powered live streams, Redis caching, and PostgreSQL.',
    tech_stack: JSON.stringify(['React', 'Node.js', 'PostgreSQL', 'Redis', 'WebSockets']),
    image: null, live_url: null, github_url: null, featured: 1, order_index: 1,
  },
  {
    slug: 'authvault',
    title: 'AuthVault',
    description: 'Zero-trust authentication SDK supporting OAuth2, magic links, and passkeys.',
    long_description: 'Production-ready auth SDK with 5k+ weekly npm downloads.',
    tech_stack: JSON.stringify(['TypeScript', 'OAuth2', 'WebAuthn', 'Node.js']),
    image: null, live_url: null, github_url: null, featured: 1, order_index: 2,
  },
];

for (const p of sample) {
  await connection.query(
    `INSERT IGNORE INTO projects
      (slug, title, description, long_description, tech_stack, image, live_url, github_url, featured, order_index)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [p.slug, p.title, p.description, p.long_description, p.tech_stack,
     p.image, p.live_url, p.github_url, p.featured, p.order_index]
  );
}

console.log('✅ Sample projects seeded');
console.log('\n🚀 Database setup complete!');
await connection.end();
