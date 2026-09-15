import { useEffect, useRef } from 'react';

export const useScrollReveal = (deps = []) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    // Observe all .reveal elements inside the container
    const reveals = el.querySelectorAll('.reveal');
    reveals.forEach((item, i) => {
      item.style.transitionDelay = `${i * 80}ms`;
      observer.observe(item);
    });

    if (el.classList.contains('reveal')) observer.observe(el);

    return () => observer.disconnect();
  // Re-run whenever deps change (e.g. after projects load)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
};
