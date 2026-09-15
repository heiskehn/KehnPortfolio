import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProjectBySlug, getImageUrl } from '../../utils/api';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProjectBySlug(slug)
      .then(data => setProject(data.project))
      .catch(() => setError('Project not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="project-detail-loading">
      <div className="loading-bar" />
    </div>
  );

  if (error || !project) return (
    <div className="project-detail-error">
      <h2>404</h2>
      <p>Project not found.</p>
      <Link to="/" className="btn-secondary">← Back Home</Link>
    </div>
  );

  const techStack = Array.isArray(project.tech_stack)
    ? project.tech_stack
    : JSON.parse(project.tech_stack || '[]');

  const imgUrl = getImageUrl(project.image);

  return (
    <div className="project-detail">
      {/* Hero banner */}
      <div className="detail-hero">
        {imgUrl ? (
          <div className="detail-hero-img">
            <img src={imgUrl} alt={project.title} />
            <div className="detail-hero-overlay" />
          </div>
        ) : (
          <div className="detail-hero-placeholder">
            <div className="detail-orb" />
          </div>
        )}
      </div>

      <div className="detail-content">
        <Link to="/" className="back-link">← Back to Portfolio</Link>

        {project.featured && <div className="detail-badge">Featured Project</div>}

        <h1 className="detail-title">{project.title}</h1>

        <div className="detail-meta">
          <div className="detail-meta-item">
            <span className="meta-label">Created</span>
            <span className="meta-value">
              {new Date(project.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
            </span>
          </div>
          {project.live_url && (
            <div className="detail-meta-item">
              <span className="meta-label">Live</span>
              <a href={project.live_url} target="_blank" rel="noreferrer" className="meta-link">
                Visit Site ↗
              </a>
            </div>
          )}
          {project.github_url && (
            <div className="detail-meta-item">
              <span className="meta-label">Source</span>
              <a href={project.github_url} target="_blank" rel="noreferrer" className="meta-link">
                GitHub ↗
              </a>
            </div>
          )}
        </div>

        <div className="detail-body">
          <div className="detail-description">
            <h2 className="detail-section-title">Overview</h2>
            <p>{project.long_description || project.description}</p>
          </div>

          <div className="detail-stack">
            <h2 className="detail-section-title">Tech Stack</h2>
            <div className="detail-tags">
              {techStack.map(tech => (
                <span key={tech} className="tag">{tech}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="detail-actions">
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noreferrer" className="btn-primary">
              View Live Site ↗
            </a>
          )}
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noreferrer" className="btn-secondary">
              View on GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
