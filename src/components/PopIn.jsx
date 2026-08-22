import React from 'react';
import useInView from '../hooks/useInView';

/**
 * Wraps any element with a pop-in animation when it enters the viewport.
 * @param {string} direction - 'up' | 'left' | 'right'
 * @param {number} delay - additional delay in ms
 * @param {string} className - extra classes
 */
const PopIn = ({ children, direction = 'up', delay = 0, className = '', as: Tag = 'div' }) => {
  const [ref, isInView] = useInView();

  const animClass =
    direction === 'left' ? 'pop-in-left' :
    direction === 'right' ? 'pop-in-right' :
    'pop-in';

  return (
    <Tag
      ref={ref}
      className={`${animClass} ${isInView ? 'in-view' : ''} ${className}`}
      style={{ animationDelay: delay ? `${delay}ms` : undefined }}
    >
      {children}
    </Tag>
  );
};

export default PopIn;
