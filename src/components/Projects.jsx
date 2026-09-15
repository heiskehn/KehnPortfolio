import React, { useEffect, useState } from 'react';
import { fetchProjects } from '../utils/api';
import ProjectCard from './ProjectCard';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pass projects.length as dep so observer re-runs after cards render
  const ref = useScrollReveal([projects.length]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProjects();
        setProjects(data.projects || []);
      } catch (err) {
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section className="section projects-section" id="projects" ref={ref}>
      <div className="section-label">Selected Work</div>
      <h2 className="section-title reveal">
        Projects that<br />shipped.
      </h2>

      {loading && (
        <div className="projects-loading">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="project-skeleton" />
          ))}
        </div>
      )}

      {error && (
        <div className="projects-error">
          <span>⚠ {error}</span>
          <p>Make sure the backend server is running on port 5000</p>
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="projects-empty">
          <p>No projects yet. <a href="/admin">Add your first project →</a></p>
        </div>
      )}

      {!loading && !error && projects.length > 0 && (
        <div className="projects-grid">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              featured={!!project.featured}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Projects;
