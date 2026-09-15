import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import Skills from '../components/Skills';
import Contact from '../components/Contact';

const Home = () => (
  <main>
    <Hero />
    <div className="divider" />
    <About />
    <div className="divider" />
    <Projects />
    <div className="divider" />
    <Skills />
    <div className="divider" />
    <Contact />
    <footer>
      <span>© 2025 DEV.OS — Full-Stack Developer</span>
      <span>Designed &amp; Built with precision</span>
    </footer>
  </main>
);

export default Home;
