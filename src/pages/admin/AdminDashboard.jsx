import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchProjects, deleteProject, createProject, updateProject,
  fetchProfile, updateProfile,
} from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

const EMPTY_PROJECT = {
  title: '', description: '', long_description: '', tech_stack: '',
  image_url: '', live_url: '', github_url: '', featured: false, order_index: 0,
};

const EMPTY_PROFILE = {
  name: '', title: '', bio: '', photo_url: '', resume_url: '',
  email: '', github_url: '', linkedin_url: '', twitter_url: '', available: true,
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('projects');
  // Projects state
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState(EMPTY_PROJECT);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  // Profile state
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  // Shared
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  // ── Load data ──────────────────────────────────────────────
  const loadProjects = async () => {
    try {
      const data = await fetchProjects();
      setProjects(data.projects || []);
    } catch { setError('Failed to load projects'); }
    finally { setProjectsLoading(false); }
  };

  const loadProfile = async () => {
    try {
      const data = await fetchProfile();
      if (data.profile) setProfile(data.profile);
    } catch { setError('Failed to load profile'); }
    finally { setProfileLoading(false); }
  };

  useEffect(() => { loadProjects(); loadProfile(); }, []);

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  // ── Projects CRUD ──────────────────────────────────────────
  const openAdd = () => {
    setEditingProject(null);
    setProjectForm(EMPTY_PROJECT);
    setError('');
    setShowForm(true);
  };

  const openEdit = (project) => {
    setEditingProject(project);
    const tech = Array.isArray(project.tech_stack)
      ? project.tech_stack.join(', ') : project.tech_stack || '';
    setProjectForm({
      title: project.title || '',
      description: project.description || '',
      long_description: project.long_description || '',
      tech_stack: tech,
      image_url: project.image || '',
      live_url: project.live_url || '',
      github_url: project.github_url || '',
      featured: !!project.featured,
      order_index: project.order_index || 0,
    });
    setError('');
    setShowForm(true);
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        ...projectForm,
        tech_stack: projectForm.tech_stack.split(',').map(s => s.trim()).filter(Boolean),
        order_index: parseInt(projectForm.order_index) || 0,
      };
      if (editingProject) {
        await updateProject(editingProject.id, payload);
        showSuccess('Project updated successfully');
      } else {
        await createProject(payload);
        showSuccess('Project created successfully');
      }
      setShowForm(false);
      loadProjects();
    } catch (err) { setError(err.message); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      setProjects(p => p.filter(proj => proj.id !== id));
      setDeleteConfirm(null);
      showSuccess('Project deleted');
    } catch (err) { setError(err.message); }
  };

  const pf = (key, val) => setProjectForm(f => ({ ...f, [key]: val }));

  // ── Profile save ───────────────────────────────────────────
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setError('');
    try {
      await updateProfile(profile);
      showSuccess('Profile updated successfully');
    } catch (err) { setError(err.message); }
    finally { setProfileSaving(false); }
  };

  const pp = (key, val) => setProfile(f => ({ ...f, [key]: val }));

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">DEV.OS</div>
        <div className="sidebar-label">Admin Panel</div>
        <nav className="sidebar-nav">
          <span
            className={`sidebar-nav-item ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >📁 Projects</span>
          <span
            className={`sidebar-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >👤 Profile</span>
        </nav>
        <button className="sidebar-logout" onClick={() => { logout(); navigate('/admin'); }}>
          ⎋ Logout
        </button>
      </aside>

      {/* Main */}
      <main className="admin-main">
        {success && <div className="admin-success">✓ {success}</div>}
        {error && !showForm && <div className="admin-error">⚠ {error}</div>}

        {/* ── PROJECTS TAB ── */}
        {activeTab === 'projects' && (
          <>
            <div className="admin-header">
              <div>
                <h1 className="admin-title">Projects</h1>
                <p className="admin-subtitle">{projects.length} total · manage your work</p>
              </div>
              <button className="btn-primary" onClick={openAdd}>+ Add Project</button>
            </div>

            {projectsLoading ? (
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
                        <p className="row-desc">{project.description?.substring(0, 100)}...</p>
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

            {/* Delete confirm modal */}
            {deleteConfirm && (
              <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                <div className="modal" onClick={e => e.stopPropagation()}>
                  <h3 className="modal-title">Delete Project?</h3>
                  <p className="modal-text">This cannot be undone.</p>
                  <div className="modal-actions">
                    <button className="btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                    <button className="row-btn danger" onClick={() => handleDelete(deleteConfirm)}>Confirm Delete</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── PROFILE TAB ── */}
        {activeTab === 'profile' && (
          <>
            <div className="admin-header">
              <div>
                <h1 className="admin-title">Profile</h1>
                <p className="admin-subtitle">Your photo, bio, social links & resume</p>
              </div>
            </div>

            {profileLoading ? (
              <div className="admin-loading">Loading profile...</div>
            ) : (
              <form onSubmit={handleProfileSubmit} className="profile-form">

                {/* Photo section */}
                <div className="profile-section">
                  <div className="profile-section-title">
                    <span className="profile-section-icon">📸</span> Photo
                  </div>
                  <div className="profile-photo-preview">
                    {profile.photo_url ? (
                      <img src={profile.photo_url} alt="Profile" className="photo-thumb" />
                    ) : (
                      <div className="photo-thumb-empty">No photo</div>
                    )}
                    <div className="photo-upload-info">
                      <div className="field-group" style={{flex:1}}>
                        <label className="field-label">Photo URL</label>
                        <input className="field-input" value={profile.photo_url}
                          onChange={e => pp('photo_url', e.target.value)}
                          placeholder="https://res.cloudinary.com/your-image.jpg" />
                        <span className="field-hint">
                          Upload to <a href="https://cloudinary.com" target="_blank" rel="noreferrer">Cloudinary</a> (free) → paste URL here
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Basic info */}
                <div className="profile-section">
                  <div className="profile-section-title">
                    <span className="profile-section-icon">👤</span> Basic Info
                  </div>
                  <div className="form-row">
                    <div className="field-group">
                      <label className="field-label">Your Name</label>
                      <input className="field-input" value={profile.name}
                        onChange={e => pp('name', e.target.value)}
                        placeholder="Kehn" />
                    </div>
                    <div className="field-group">
                      <label className="field-label">Title / Role</label>
                      <input className="field-input" value={profile.title}
                        onChange={e => pp('title', e.target.value)}
                        placeholder="Full-Stack Developer" />
                    </div>
                  </div>
                  <div className="field-group">
                    <label className="field-label">Bio</label>
                    <textarea className="field-input" rows="4" value={profile.bio}
                      onChange={e => pp('bio', e.target.value)}
                      placeholder="I'm a Full-Stack Developer obsessed with clean code and fast products..." />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Email</label>
                    <input className="field-input" type="email" value={profile.email}
                      onChange={e => pp('email', e.target.value)}
                      placeholder="hello@yourdomain.com" />
                  </div>
                </div>

                {/* Social links */}
                <div className="profile-section">
                  <div className="profile-section-title">
                    <span className="profile-section-icon">🔗</span> Social Links
                  </div>
                  <div className="form-row">
                    <div className="field-group">
                      <label className="field-label">GitHub URL</label>
                      <input className="field-input" value={profile.github_url}
                        onChange={e => pp('github_url', e.target.value)}
                        placeholder="https://github.com/yourhandle" />
                    </div>
                    <div className="field-group">
                      <label className="field-label">LinkedIn URL</label>
                      <input className="field-input" value={profile.linkedin_url}
                        onChange={e => pp('linkedin_url', e.target.value)}
                        placeholder="https://linkedin.com/in/yourname" />
                    </div>
                  </div>
                  <div className="field-group">
                    <label className="field-label">Twitter / X URL</label>
                    <input className="field-input" value={profile.twitter_url}
                      onChange={e => pp('twitter_url', e.target.value)}
                      placeholder="https://twitter.com/yourhandle" />
                  </div>
                </div>

                {/* Resume */}
                <div className="profile-section">
                  <div className="profile-section-title">
                    <span className="profile-section-icon">📄</span> Resume
                  </div>
                  <div className="field-group">
                    <label className="field-label">Resume PDF URL</label>
                    <input className="field-input" value={profile.resume_url}
                      onChange={e => pp('resume_url', e.target.value)}
                      placeholder="https://drive.google.com/file/d/your-resume.pdf" />
                    <span className="field-hint">
                      Upload to Google Drive or Cloudinary → share link → paste here
                    </span>
                  </div>
                  {profile.resume_url && (
                    <a href={profile.resume_url} target="_blank" rel="noreferrer" className="resume-preview-link">
                      View current resume ↗
                    </a>
                  )}
                </div>

                {/* Availability toggle */}
                <div className="profile-section">
                  <div className="profile-section-title">
                    <span className="profile-section-icon">🟢</span> Availability
                  </div>
                  <label className="toggle-label">
                    <div className={`toggle ${profile.available ? 'on' : ''}`}
                      onClick={() => pp('available', !profile.available)}>
                      <div className="toggle-knob" />
                    </div>
                    <span className="field-label" style={{marginBottom:0}}>
                      {profile.available ? 'Currently available for work' : 'Not available right now'}
                    </span>
                  </label>
                </div>

                <div className="form-actions" style={{padding: '0', borderTop: 'none', marginTop: '8px'}}>
                  <button type="submit" className="btn-primary" disabled={profileSaving}>
                    {profileSaving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </main>

      {/* Project Form Drawer */}
      {showForm && (
        <div className="form-overlay" onClick={() => setShowForm(false)}>
          <div className="form-drawer" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <h2 className="drawer-title">{editingProject ? 'Edit Project' : 'New Project'}</h2>
              <button className="drawer-close" onClick={() => setShowForm(false)}>✕</button>
            </div>

            {error && <div className="admin-error" style={{margin:'0 32px 16px'}}>⚠ {error}</div>}

            <form onSubmit={handleProjectSubmit} className="project-form">
              <div className="form-row">
                <div className="field-group">
                  <label className="field-label">Title *</label>
                  <input className="field-input" value={projectForm.title}
                    onChange={e => pf('title', e.target.value)}
                    placeholder="Project Name" required />
                </div>
                <div className="field-group">
                  <label className="field-label">Order Index</label>
                  <input className="field-input" type="number" value={projectForm.order_index}
                    onChange={e => pf('order_index', parseInt(e.target.value) || 0)} />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Short Description *</label>
                <textarea className="field-input" rows="2" value={projectForm.description}
                  onChange={e => pf('description', e.target.value)}
                  placeholder="Brief description shown on cards" required />
              </div>

              <div className="field-group">
                <label className="field-label">Full Description</label>
                <textarea className="field-input" rows="4" value={projectForm.long_description}
                  onChange={e => pf('long_description', e.target.value)}
                  placeholder="Detailed description for the project page..." />
              </div>

              <div className="field-group">
                <label className="field-label">Tech Stack (comma-separated)</label>
                <input className="field-input" value={projectForm.tech_stack}
                  onChange={e => pf('tech_stack', e.target.value)}
                  placeholder="React, Node.js, PostgreSQL, Docker" />
              </div>

              <div className="field-group">
                <label className="field-label">Image URL</label>
                <input className="field-input" value={projectForm.image_url}
                  onChange={e => pf('image_url', e.target.value)}
                  placeholder="https://res.cloudinary.com/... or any image URL" />
                <span className="field-hint">
                  Upload to <a href="https://cloudinary.com" target="_blank" rel="noreferrer">Cloudinary</a> → paste URL
                </span>
                {projectForm.image_url && (
                  <img src={projectForm.image_url} alt="preview"
                    style={{marginTop:8, maxHeight:120, objectFit:'cover', border:'1px solid var(--border)'}}
                    onError={e => e.target.style.display='none'} />
                )}
              </div>

              <div className="form-row">
                <div className="field-group">
                  <label className="field-label">Live URL</label>
                  <input className="field-input" value={projectForm.live_url}
                    onChange={e => pf('live_url', e.target.value)}
                    placeholder="https://your-project.com" />
                </div>
                <div className="field-group">
                  <label className="field-label">GitHub URL</label>
                  <input className="field-input" value={projectForm.github_url}
                    onChange={e => pf('github_url', e.target.value)}
                    placeholder="https://github.com/you/repo" />
                </div>
              </div>

              <div className="field-group">
                <label className="toggle-label">
                  <div className={`toggle ${projectForm.featured ? 'on' : ''}`}
                    onClick={() => pf('featured', !projectForm.featured)}>
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
