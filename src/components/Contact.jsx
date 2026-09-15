import React from 'react';
import './Contact.css';

const Contact = () => (
  <section className="section contact-section" id="contact">
    <div className="section-label">Contact</div>

    <div className="contact-title">
      <span>Let's build</span>
      <strong>something.</strong>
    </div>

    <a href="mailto:hello@devportfolio.io" className="contact-email">
      hello@devportfolio.io
    </a>

    <div className="contact-socials">
      <a href="https://github.com" target="_blank" rel="noreferrer" className="social-link">↗ GitHub</a>
      <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-link">↗ LinkedIn</a>
      <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-link">↗ Twitter</a>
      <a href="/resume.pdf" target="_blank" rel="noreferrer" className="social-link">↗ Resume PDF</a>
    </div>

    <div className="contact-availability">
      <span className="avail-dot" />
      Available for freelance &amp; full-time roles
    </div>
  </section>
);

export default Contact;
