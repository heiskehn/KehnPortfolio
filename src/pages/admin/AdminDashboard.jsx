import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProjects, deleteProject, createProject, updateProject } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

const EMPTY_FORM = {
  title: '', description: '', long_description: '', tech_stack: '',
  image_url: '', live_url: '', github_url: '', featured: false, order_index: 0,
};

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const loadProjects = async () => {
    try {
      const data = await fetchProjects();
      setProjects(data.projects || []);
    } catch { setError('Failed to load projects'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadProjects(); }, []);

  const openAdd = () => {
    setEditingProject(null);
    setForm(EMPTY_FORM);
    setError('');
    setShowForm(true);
  };

  const openEdit = (project) => {
    setEditingProject(project);
    const tech = Array.isArray(project.tech_stack)
      ? project.tech_stack.join(', ')
      : project.tech_stack;
    setForm({
      title: project.title,
      description: project.description,
      long_description: project.long_description || '',
      tech_stack: tech || '',
      image_url: project.image || '',
      live_url: project.live_url || '',
      github_url: project.github_url || '',
      featured: !!project.featured,
      order_index: project.order_index || 0,
    });
    setError('');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const techArray = form.tech_stack
        .split(',').map(s => s.trim()).filter(Boolean);

      const payload = {
        ...form,
        tech_stack: techArray,
        order_index: parseInt(form.order_index) || 0,
      };

      if (editingProject) {
        await updateProject(editingProject.id, payload);
        setSuccess('Project updated successfully');
      } else {
        await createProject(payload);
        setSuccess('Project created successfully');
      }

      setShowForm(false);
      loadProjects();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      setProjects(p => p.filter(proj => proj.id !== id));
      setDeleteConfirm(null);
      setSuccess('Project deleted');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { setError(err.message); }
  };

  const field = (key, value) => setForm(f => ({ ...f, [key]: value }));

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="sidebar-logo">DEV.OS</div>
        <div className="sidebar-label">Admin Panel</div>
        <nav className="sidebar-nav">
          <span className="sidebar-nav-item active">📁 Projects</span>
        </nav>
        <button className="sidebar-logout" onClick={() => { logout(); navigate('/admin'); }}>
          ⎋ Logout
        </button>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Projects</h1>
            <p className="admin-subtitle">{projects.length} total · manage your portfolio</p>
          </div>
          <button className="btn-primary" onClick={openAdd}>+ Add Project</button>
        </div>

        {success && <div className="admin-success">✓ {success}</div>}
        {error && !showForm && <div className="admin-error">⚠ {error}</div>}

        {loading ? (
          <div className="admin-loading">Loading projects...</div>
        ) : (
          <div className="projects-table">
            {projects.length === 0 ? (
              <div className="table-empty">
                <p>No projects yet.</p>
                <button className="btn-primary" onClick={openAdd}>Add your first project</button>
              </div>
            ) : projects.map(project => {
              const tech = Array.isArray(project.tech_stack)
                ? project.tech_stack : JSON.parse(project.tech_stack || '[]');
              return (
                <div key={project.id} className="table-row">
                  <div className="row-info">
                    <div className="row-header">
                      <span className="row-title">{project.title}</span>
                      {project.featured ? <span className="row-badge">Featured</span> : null}
                    </div>
                    <p className="row-desc">{project.description.substring(0, 100)}...</p>
                    <div className="row-tech">
                      {tech.slice(0, 5).map(t => <span key={t} className="tag">{t}</span>)}
                    </div>
                  </div>
                  <div className="row-actions">
                    {project.live_url && (
                      <a href={project.live_url} target="_blank" rel="noreferrer" className="row-btn">Live ↗</a>
                    )}
                    <button className="row-btn" onClick={() => openEdit(project)}>Edit</button>
                    <button className="row-btn danger" onClick={() => setDeleteConfirm(project.id)}>Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {deleteConfirm && (
          <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h3 className="modal-title">Delete Project?</h3>
              <p className="modal-text">This action cannot be undone.</p>
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                <button className="row-btn danger" onClick={() => handleDelete(deleteConfirm)}>Confirm Delete</button>
              </div>
            </div>
          </div>
        )}
      </main>

      {showForm && (
        <div className="form-overlay" onClick={() => setShowForm(false)}>
          <div className="form-drawer" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <h2 className="drawer-title">{editingProject ? 'Edit Project' : 'New Project'}</h2>
              <button className="drawer-close" onClick={() => setShowForm(false)}>✕</button>
            </div>

            {error && <div className="admin-error" style={{margin:'0 32px'}}>{error}</div>}

            <form onSubmit={handleSubmit} className="project-form">
              <div className="form-row">
                <div className="field-group">
                  <label className="field-label">Title *</label>
                  <input className="field-input" value={form.title}
                    onChange={e => field('title', e.target.value)}
                    placeholder="Project Name" required />
                </div>
                <div className="field-group">
                  <label className="field-label">Order Index</label>
                  <input className="field-input" type="number" value={form.order_index}
                    onChange={e => field('order_index', parseInt(e.target.value) || 0)} />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Short Description *</label>
                <textarea className="field-input" rows="2" value={form.description}
                  onChange={e => field('description', e.target.value)}
                  placeholder="Brief description shown on cards" required />
              </div>

              <div className="field-group">
                <label className="field-label">Full Description</label>
                <textarea className="field-input" rows="4" value={form.long_description}
                  onChange={e => field('long_description', e.target.value)}
                  placeholder="Detailed description for the project page..." />
              </div>

              <div className="field-group">
                <label className="field-label">Tech Stack (comma-separated)</label>
                <input className="field-input" value={form.tech_stack}
                  onChange={e => field('tech_stack', e.target.value)}
                  placeholder="React, Node.js, PostgreSQL, Docker" />
              </div>

              <div className="field-group">
                <label className="field-label">Image URL</label>
                <input className="field-input" value={form.image_url}
                  onChange={e => field('image_url', e.target.value)}
                  placeholder="https://res.cloudinary.com/... or any image URL" />
                <span className="field-hint">
                  Host images on <a href="https://cloudinary.com" target="_blank" rel="noreferrer">Cloudinary</a> (free) and paste the URL here
                </span>
                {form.image_url && (
                  <img src={form.image_url} alt="preview"
                    style={{ marginTop:8, maxHeight:120, objectFit:'cover', border:'1px solid var(--border)' }}
                    onError={e => e.target.style.display='none'} />
                )}
              </div>

              <div className="form-row">
                <div className="field-group">
                  <label className="field-label">Live URL</label>
                  <input className="field-input" value={form.live_url}
                    onChange={e => field('live_url', e.target.value)}
                    placeholder="https://your-project.com" />
                </div>
                <div className="field-group">
                  <label className="field-label">GitHub URL</label>
                  <input className="field-input" value={form.github_url}
                    onChange={e => field('github_url', e.target.value)}
                    placeholder="https://github.com/you/repo" />
                </div>
              </div>

              <div className="field-group">
                <label className="toggle-label">
                  <div className={`toggle ${form.featured ? 'on' : ''}`}
                    onClick={() => field('featured', !form.featured)}>
                    <div className="toggle-knob" />
                  </div>
                  <span className="field-label" style={{marginBottom:0}}>Featured Project</span>
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
