import React, { useState, useEffect } from 'react';
import { fetchProfile } from '../utils/api';
import './Contact.css';

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const ResumeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6zm2-6h8v1.5H8V14zm0 3h5v1.5H8V17zm0-6h2v1.5H8V11z"/>
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
  </svg>
);

const Contact = () => {
  const [profile, setProfile] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchProfile().then(d => setProfile(d.profile)).catch(() => {});
  }, []);

  const email = profile?.email || 'hello@devportfolio.io';
  const available = profile?.available !== false;

  const socials = [
    profile?.github_url && {
      name: 'GitHub', handle: '@' + (profile.github_url.split('/').pop() || 'github'),
      href: profile.github_url, icon: <GitHubIcon />, desc: 'View my code & open source',
    },
    profile?.linkedin_url && {
      name: 'LinkedIn', handle: profile.name || 'Your Name',
      href: profile.linkedin_url, icon: <LinkedInIcon />, desc: 'Professional network',
    },
    profile?.twitter_url && {
      name: 'X / Twitter', handle: '@' + (profile.twitter_url.split('/').pop() || 'twitter'),
      href: profile.twitter_url, icon: <TwitterIcon />, desc: 'Thoughts & updates',
    },
    profile?.resume_url && {
      name: 'Résumé', handle: 'Download PDF',
      href: profile.resume_url, icon: <ResumeIcon />, desc: 'Full work history',
    },
  ].filter(Boolean);

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="section contact-section" id="contact">
      <div className="section-label">Contact</div>

      <div className="contact-headline">
        <div className="contact-headline-top">Let's build</div>
        <div className="contact-headline-bottom">something<span className="headline-dot">.</span></div>
      </div>

      <p className="contact-subtext">
        Open to freelance projects, full-time roles, and interesting collaborations.
        <br />If you have an idea — let's talk.
      </p>

      <div className="contact-email-block">
        <div className="email-label">
          <EmailIcon />
          <span>Send a message</span>
        </div>
        <div className="email-row">
          <a href={`mailto:${email}`} className="contact-email-address">{email}</a>
          <button className="copy-btn" onClick={copyEmail}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {socials.length > 0 && (
        <>
          <div className="contact-divider"><span>or find me on</span></div>
          <div className="contact-socials-grid" style={{gridTemplateColumns: `repeat(${Math.min(socials.length, 4)}, 1fr)`}}>
            {socials.map(s => (
              <a key={s.name} href={s.href} target="_blank" rel="noreferrer" className="social-card">
                <div className="social-card-icon">{s.icon}</div>
                <div className="social-card-info">
                  <span className="social-card-name">{s.name}</span>
                  <span className="social-card-handle">{s.handle}</span>
                </div>
                <div className="social-card-desc">{s.desc}</div>
                <div className="social-card-arrow">↗</div>
              </a>
            ))}
          </div>
        </>
      )}

      {socials.length === 0 && (
        <div className="contact-divider">
          <span>Add your social links in Admin → Profile</span>
        </div>
      )}

      <div className="contact-availability">
        <span className="avail-dot" style={{background: available ? 'var(--neon)' : '#ff6b6b'}} />
        <span>{available ? 'Currently available for new projects' : 'Not available right now'}</span>
        {available && <><span className="avail-sep">·</span><span>Response within 24hrs</span></>}
      </div>
    </section>
  );
};

export default Contact;
