import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './About.css';

const About = () => {
  const ref = useScrollReveal();

  return (
    <section className="section about-section" id="about" ref={ref}>
      <div className="section-label">About</div>
      <h2 className="section-title reveal">
        I build things<br />that <em className="neon-em">scale.</em>
      </h2>

      <div className="about-grid">
        {/* Developer Photo */}
        <div className="about-photo-col reveal">
          <div className="photo-frame">
            <div className="photo-inner">
              {/* Replace the src below with your actual image path */}
              <img
                src="/images/developer.jpg"
                alt="Developer"
                className="dev-photo"
                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
              />
              <div className="photo-placeholder">
                <span className="photo-placeholder-icon">[ YOUR PHOTO ]</span>
                <span className="photo-placeholder-hint">Add /public/images/developer.jpg</span>
              </div>
            </div>
            <div className="photo-badge">
              <span className="avail-dot" />
              Available for Work
            </div>
            <div className="photo-decoration" />
          </div>
        </div>

        {/* Text content */}
        <div className="about-content">
          <div className="about-text reveal">
            <p>
              I'm a <strong>Full-Stack Developer</strong> obsessed with clean code,
              fast products, and systems that hold up under pressure. I've designed
              and deployed everything from solo indie projects to enterprise-scale platforms.
            </p>
            <p>
              My approach blends <strong>engineering rigor with product thinking</strong> — 
              I don't just write code, I solve problems. Every architecture decision, every 
              API design, every UI micro-interaction is intentional.
            </p>
            <p>
              When I'm not pushing commits, I'm exploring emerging tech, contributing 
              to open-source, and staying ahead of what's next.
            </p>
          </div>

          <div className="about-terminal reveal">
            <div className="terminal">
              <div className="terminal-header">● ● ●</div>
              <div className="t-comment">{'// developer.config.js'}</div>
              <br />
              <div><span className="t-key">const</span> <span className="t-val">dev</span> = {'{'}</div>
              <div>&nbsp;&nbsp;<span className="t-key">role</span>: <span className="t-str">"Full-Stack Developer"</span>,</div>
              <div>&nbsp;&nbsp;<span className="t-key">focus</span>: [<span className="t-str">"React"</span>, <span className="t-str">"Node"</span>, <span className="t-str">"Python"</span>],</div>
              <div>&nbsp;&nbsp;<span className="t-key">loves</span>: <span className="t-str">"shipping fast"</span>,</div>
              <div>&nbsp;&nbsp;<span className="t-key">available</span>: <span className="t-bool">true</span>,</div>
              <div>&nbsp;&nbsp;<span className="t-key">remote</span>: <span className="t-bool">true</span>,</div>
              <div>{'}'}</div>
              <br />
              <div><span className="t-comment">{'// Open to new projects'}</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
