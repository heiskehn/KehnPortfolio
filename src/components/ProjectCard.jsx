import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/api';
import './ProjectCard.css';

const ProjectCard = ({ project, index, featured }) => {
  const cardRef = useRef(null);

  const onMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cardRef.current.style.setProperty('--mx', x + '%');
    cardRef.current.style.setProperty('--my', y + '%');
  };

  const techStack = Array.isArray(project.tech_stack)
    ? project.tech_stack
    : JSON.parse(project.tech_stack || '[]');

  const imgUrl = getImageUrl(project.image);

  const PROJECT_ICONS = ['⚡', '🔐', '🌐', '🤖', '📦', '🔮', '🛸', '💡'];
  const icon = PROJECT_ICONS[index % PROJECT_ICONS.length];

  return (
    <Link
      to={`/projects/${project.slug}`}
      className={`project-card reveal ${featured ? 'featured' : ''}`}
      ref={cardRef}
      onMouseMove={onMouseMove}
    >
      <div className="card-glow" />

      {featured && <div className="featured-badge">Featured</div>}

      {imgUrl ? (
        <div className="project-img-wrap">
          <img src={imgUrl} alt={project.title} className="project-img" />
        </div>
      ) : (
        <div className="project-icon-wrap">
          <span className="project-icon">{icon}</span>
        </div>
      )}

      <div className="project-num">
        {String(index + 1).padStart(2, '0')} {featured ? '· FEATURED' : ''}
      </div>

      <h3 className="project-name">{project.title}</h3>
      <p className="project-desc">{project.description}</p>

      <div className="project-tags">
        {techStack.slice(0, 4).map(tech => (
          <span key={tech} className="tag">{tech}</span>
        ))}
        {techStack.length > 4 && (
          <span className="tag">+{techStack.length - 4}</span>
        )}
      </div>

      <div className="project-footer">
        <span className="project-link-text">View Details →</span>
        <div className="project-ext-links">
          {project.live_url && (
            <span
              className="ext-link"
              onClick={(e) => { e.preventDefault(); window.open(project.live_url, '_blank'); }}
            >Live ↗</span>
          )}
          {project.github_url && (
            <span
              className="ext-link"
              onClick={(e) => { e.preventDefault(); window.open(project.github_url, '_blank'); }}
            >GitHub ↗</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
