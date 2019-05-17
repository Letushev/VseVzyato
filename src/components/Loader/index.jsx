import React, { useEffect, useState, useRef } from 'react';
import cn from 'classnames';
import styles from './styles.module.scss';

export function Loader({ className, delay }) {
  const [isVisible, setIsVisible] = useState(!delay);
  const t = useRef(null);

  useEffect(() => {
    if (delay) {
      t.current = setTimeout(() => {
        setIsVisible(true);
      }, delay);
    }

    return () => {
      clearTimeout(t.current);
    }
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={cn(styles.ring, className)}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

