import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  const orb1 = useRef(null);
  const orb2 = useRef(null);

  useEffect(() => {
    const onMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      if (orb1.current) orb1.current.style.transform = `translate(${x}px, ${y}px)`;
      if (orb2.current) orb2.current.style.transform = `translate(${-x * 0.5}px, ${-y * 0.5}px)`;
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <section className="hero">
      <div className="orb orb-1" ref={orb1} />
      <div className="orb orb-2" ref={orb2} />

      <div className="hero-tag">
        <span className="tag-line" />
        Full-Stack Developer · Available for Work
      </div>

      <h1 className="hero-title">
        <span className="line-1">Building</span>
        <span className="line-2">Digital</span>
        <span className="line-3">Futures.</span>
      </h1>

      <p className="hero-desc">
        I craft high-performance web applications that live at the intersection of
        engineering precision and creative vision. From backend architecture to
        pixel-perfect frontends — I ship products that matter.
      </p>

      <div className="hero-actions">
        <a href="#projects" className="btn-primary">View My Work ↗</a>
        <a href="#contact" className="btn-secondary">Get in Touch</a>
      </div>

      <div className="hero-stats">
        <div className="stat-card">
          <div className="stat-num">50+</div>
          <div className="stat-label">Projects Shipped</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">5yr</div>
          <div className="stat-label">Experience</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">12+</div>
          <div className="stat-label">Technologies</div>
        </div>
      </div>

      <div className="scroll-hint">
        <div className="scroll-line" />
        <span className="scroll-text">Scroll</span>
      </div>
    </section>
  );
};

export default Hero;
