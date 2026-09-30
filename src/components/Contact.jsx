import { useState, useEffect } from 'react';
import './Contact.css';
import { fetchProfile } from '../utils/api';

const Contact = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchProfile().then(setProfile).catch(() => {});
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      return;
    }
    // mailto fallback — replace with EmailJS or Resend if needed
    const mailto = `mailto:${profile?.email || 'hello@kehn.dev'}?subject=Portfolio Contact from ${formData.name}&body=${encodeURIComponent(formData.message)}`;
    window.location.href = mailto;
    setStatus('sent');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section className="contact" id="contact">
      <div className="contact-container">
        <div className="contact-header">
          <span className="contact-tag">// contact</span>
          <h2 className="contact-title">Let's <span className="contact-accent">Work</span> Together</h2>
          <p className="contact-subtitle">
            Have a project in mind? I'm always open to discussing new opportunities.
          </p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-card">
              <div className="contact-card-header">
                <span className="contact-card-icon">📡</span>
                <h3>Get In Touch</h3>
              </div>
              <div className="contact-links">
                {profile?.email && (
                  <a href={`mailto:${profile.email}`} className="contact-link">
                    <span className="link-icon">✉</span>
                    <span>{profile.email}</span>
                  </a>
                )}
                {profile?.github_url && (
                  <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="contact-link">
                    <span className="link-icon">⌥</span>
                    <span>GitHub</span>
                  </a>
                )}
                {profile?.linkedin_url && (
                  <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="contact-link">
                    <span className="link-icon">◈</span>
                    <span>LinkedIn</span>
                  </a>
                )}
                {profile?.twitter_url && (
                  <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer" className="contact-link">
                    <span className="link-icon">◎</span>
                    <span>Twitter / X</span>
                  </a>
                )}
              </div>

              {profile?.available_for_work && (
                <div className="availability-badge">
                  <span className="availability-dot"></span>
                  Available for new projects
                </div>
              )}
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                className="form-input"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea
                className="form-textarea"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me about your project..."
                rows={5}
                required
              />
            </div>
            {status === 'error' && (
              <p className="form-error">Please fill in all fields.</p>
            )}
            {status === 'sent' && (
              <p className="form-success">Opening your mail client…</p>
            )}
            <button type="submit" className="form-submit">
              Send Message <span className="submit-arrow">→</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
