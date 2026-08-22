import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook to detect when an element enters the viewport.
 * @param {Object} options - IntersectionObserver options
 * @returns {[ref, isInView]} - ref to attach and boolean flag
 */
const useInView = (options = {}) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(entry.target); // animate once
      }
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
      ...options
    });

    const el = ref.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  return [ref, isInView];
};

export default useInView;
