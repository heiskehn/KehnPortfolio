const API = '';

const authHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
  'Content-Type': 'application/json',
});

// ── Projects ─────────────────────────────────────────────────

export const fetchProjects = async () => {
  const res = await fetch(`${API}/api/projects?t=${Date.now()}`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
};

export const fetchProjectBySlug = async (slug) => {
  const res = await fetch(`${API}/api/projects/${slug}`);
  if (!res.ok) throw new Error('Project not found');
  return res.json();
};

export const createProject = async (data) => {
  const res = await fetch(`${API}/api/projects/create`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed to create'); }
  return res.json();
};

export const updateProject = async (id, data) => {
  const res = await fetch(`${API}/api/projects/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed to update'); }
  return res.json();
};

export const deleteProject = async (id) => {
  const res = await fetch(`${API}/api/projects/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed to delete'); }
  return res.json();
};

// ── Profile ──────────────────────────────────────────────────

export const fetchProfile = async () => {
  const res = await fetch(`${API}/api/profile`);
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
};

export const updateProfile = async (data) => {
  const res = await fetch(`${API}/api/profile/update`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Failed to update profile'); }
  return res.json();
};

// ── Auth ─────────────────────────────────────────────────────

export const login = async (username, password) => {
  const res = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Login failed'); }
  return res.json();
};

export const verifyToken = async () => {
  const res = await fetch(`${API}/api/auth/verify`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` },
  });
  if (!res.ok) throw new Error('Invalid token');
  return res.json();
};

export const getImageUrl = (url) => {
  if (!url) return null;
  return url;
};
