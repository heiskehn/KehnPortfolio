import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './Skills.css';

const SKILLS = {
  Frontend: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Three.js', 'Framer Motion'],
  Backend: ['Node.js', 'Python', 'FastAPI', 'GraphQL', 'Go', 'REST APIs'],
  'Data & Infrastructure': ['PostgreSQL', 'MySQL', 'Redis', 'MongoDB', 'Docker', 'AWS', 'Terraform'],
};

const Skills = () => {
  const ref = useScrollReveal();

  return (
    <section className="section skills-section" id="skills" ref={ref}>
      <div className="section-label">Tech Stack</div>
      <h2 className="section-title reveal">
        The tools<br />I wield.
      </h2>

      <div className="skills-layout">
        <div className="skills-desc reveal">
          <p>
            I work across the full stack — from database design to deployment pipelines.
            My toolkit is always evolving, but these are the technologies I trust most.
          </p>
        </div>

        <div className="skills-groups reveal">
          {Object.entries(SKILLS).map(([group, items]) => (
            <div key={group} className="skill-group">
              <div className="skill-group-title">{group}</div>
              <div className="skill-pills">
                {items.map(skill => (
                  <span key={skill} className="skill-pill">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
