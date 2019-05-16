import React from 'react';
import cn from 'classnames';
import styles from './styles.module.scss';

export function Logo({ big }) {
  return (
    <span className={cn(
      styles.logo,
      big && styles.big,
    )}>
      ВзятоВсе
      </span>
  );
}
