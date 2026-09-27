import React, { useEffect, useState } from 'react';
import { fetchProfile } from '../utils/api';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './About.css';

const About = () => {
  const [profile, setProfile] = useState(null);
  const ref = useScrollReveal([!!profile]);

  useEffect(() => {
    fetchProfile().then(d => setProfile(d.profile)).catch(() => {});
  }, []);

  const name = profile?.name || 'Full-Stack Developer';
  const title = profile?.title || 'Full-Stack Developer';
  const bio = profile?.bio || `I'm a Full-Stack Developer obsessed with clean code, fast products, and systems that hold up under pressure. I've designed and deployed everything from solo indie projects to enterprise-scale platforms.`;
  const photoUrl = profile?.photo_url || null;
  const available = profile?.available !== false;

  return (
    <section className="section about-section" id="about" ref={ref}>
      <div className="section-label">About</div>
      <h2 className="section-title reveal">
        I build things<br />that <em className="neon-em">scale.</em>
      </h2>

      <div className="about-grid">
        {/* Photo */}
        <div className="about-photo-col reveal">
          <div className="photo-frame">
            <div className="photo-inner">
              {photoUrl ? (
                <img src={photoUrl} alt={name} className="dev-photo" />
              ) : (
                <div className="photo-placeholder" style={{display:'flex'}}>
                  <span className="photo-placeholder-icon">[ YOUR PHOTO ]</span>
                  <span className="photo-placeholder-hint">Set in Admin → Profile</span>
                </div>
              )}
            </div>
            {available && (
              <div className="photo-badge">
                <span className="avail-dot" />
                Available for Work
              </div>
            )}
            <div className="photo-decoration" />
          </div>
        </div>

        {/* Content */}
        <div className="about-content">
          <div className="about-text reveal">
            {bio.split('\n').filter(Boolean).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div className="about-terminal reveal">
            <div className="terminal">
              <div className="terminal-header">● ● ●</div>
              <div className="t-comment">{'// developer.config.js'}</div>
              <br />
              <div><span className="t-key">const</span> <span className="t-val">dev</span> = {'{'}</div>
              <div>&nbsp;&nbsp;<span className="t-key">name</span>: <span className="t-str">"{name}"</span>,</div>
              <div>&nbsp;&nbsp;<span className="t-key">role</span>: <span className="t-str">"{title}"</span>,</div>
              <div>&nbsp;&nbsp;<span className="t-key">loves</span>: <span className="t-str">"shipping fast"</span>,</div>
              <div>&nbsp;&nbsp;<span className="t-key">available</span>: <span className="t-bool">{available ? 'true' : 'false'}</span>,</div>
              <div>&nbsp;&nbsp;<span className="t-key">remote</span>: <span className="t-bool">true</span>,</div>
              <div>{'}'}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
