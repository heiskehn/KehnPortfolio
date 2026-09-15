import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="nav-logo">DEV.OS</Link>

      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <li><a href="/#about" onClick={() => setMenuOpen(false)}>About</a></li>
        <li><a href="/#projects" onClick={() => setMenuOpen(false)}>Work</a></li>
        <li><a href="/#skills" onClick={() => setMenuOpen(false)}>Stack</a></li>
        <li><a href="/#contact" onClick={() => setMenuOpen(false)}>Contact</a></li>
      </ul>

      <div className="nav-right">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '☀' : '◑'}
        </button>
        <a href="/#contact" className="nav-cta">Hire Me</a>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span className={menuOpen ? 'open' : ''}></span>
          <span className={menuOpen ? 'open' : ''}></span>
          <span className={menuOpen ? 'open' : ''}></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
