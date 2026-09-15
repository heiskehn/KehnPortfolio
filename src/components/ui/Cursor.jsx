import React, { useEffect, useRef, useCallback } from 'react';

const Cursor = () => {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  const animateRing = useCallback(() => {
    ring.current.x += (pos.current.x - ring.current.x) * 0.12;
    ring.current.y += (pos.current.y - ring.current.y) * 0.12;
    if (ringRef.current) {
      ringRef.current.style.left = ring.current.x + 'px';
      ringRef.current.style.top = ring.current.y + 'px';
    }
    rafRef.current = requestAnimationFrame(animateRing);
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px';
        cursorRef.current.style.top = e.clientY + 'px';
      }
    };

    const onEnter = () => {
      cursorRef.current?.classList.add('expanded');
      ringRef.current?.classList.add('expanded');
    };
    const onLeave = () => {
      cursorRef.current?.classList.remove('expanded');
      ringRef.current?.classList.remove('expanded');
    };

    document.addEventListener('mousemove', onMove);

    const addListeners = () => {
      document.querySelectorAll('a, button, .project-card, .skill-pill, .stat-card, input, textarea, select').forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };

    addListeners();
    const interval = setInterval(addListeners, 2000);
    rafRef.current = requestAnimationFrame(animateRing);

    return () => {
      document.removeEventListener('mousemove', onMove);
      clearInterval(interval);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animateRing]);

  return (
    <>
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={ringRef} />
    </>
  );
};

export default Cursor;
