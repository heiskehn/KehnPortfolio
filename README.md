# DEV.OS Portfolio — Vercel Deployment

## Stack
- **Frontend**: React + Vite (served as static)
- **Backend**: Vercel Serverless Functions (`/api/*`)
- **Database**: Any cloud MySQL (PlanetScale / Railway / Aiven — all free)

---

## Step 1 — Get a free cloud MySQL database

Choose one:

**Option A — Railway** (easiest)
1. Go to https://railway.app → New Project → MySQL
2. Click the MySQL service → Connect tab
3. Copy the connection details

**Option B — Aiven**
1. Go to https://aiven.io → Create MySQL service (free tier)
2. Copy host, port, user, password, database name

**Option C — PlanetScale**
1. Go to https://planetscale.com → Create database
2. Create a password → copy connection string details

---

## Step 2 — Set up the database (run once locally)

```bash
# Install deps
npm install

# Copy env template and fill in your DB credentials
cp .env.example .env.local

# Run setup (creates tables + admin user)
node scripts/setup-db.js
```

---

## Step 3 — Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (follow prompts)
vercel

# Add environment variables
vercel env add DB_HOST
vercel env add DB_PORT
vercel env add DB_USER
vercel env add DB_PASSWORD
vercel env add DB_NAME
vercel env add DB_SSL
vercel env add JWT_SECRET
vercel env add ADMIN_USERNAME
vercel env add ADMIN_PASSWORD

# Deploy to production
vercel --prod
```

Or add env vars in **Vercel Dashboard → Project → Settings → Environment Variables**.

---

## Step 4 — Local development

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Run locally (serves both frontend AND /api functions)
vercel dev
```

Visit http://localhost:3000

---

## Admin access

- URL: `https://your-site.vercel.app/admin`
- Default credentials: whatever you set in `ADMIN_USERNAME` / `ADMIN_PASSWORD`

---

## Project images

Vercel serverless functions don't support file uploads. Use **Cloudinary** (free):
1. Sign up at https://cloudinary.com
2. Upload your image → copy the URL
3. Paste the URL into the Image URL field when adding a project

---

## API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/projects` | Public | List all projects |
| GET | `/api/projects/:slug` | Public | Get project by slug |
| POST | `/api/projects/create` | Admin | Create project |
| PUT | `/api/projects/:id` | Admin | Update project |
| DELETE | `/api/projects/:id` | Admin | Delete project |
| POST | `/api/auth/login` | Public | Admin login |
| GET | `/api/auth/verify` | Admin | Verify JWT token |
| GET | `/api/health` | Public | Health check |
