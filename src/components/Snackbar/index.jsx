import React, { useState, forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { CheckIcon, ErrorIcon } from 'assets/icons';
import styles from './styles.module.scss';

const STATE = {
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
};

export const Snackbar = forwardRef(({ children, state }, ref) => {
  const [isActive, setIsActive] = useState(false);
  const timeout = useRef(null);

  const activate = () => {
    setIsActive(true);
    timeout.current = setTimeout(() => {
      setIsActive(false);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeout.current);
    };
  }, []);

  useImperativeHandle(ref, () => ({
    trigger: activate,
  }));

  return (
    <div
      className={cn(
        styles.snackbar,
        isActive && styles.active,
        state === STATE.SUCCESS && styles.success,
        state === STATE.ERROR && styles.error,
      )}
    >
      {state === STATE.SUCCESS && <CheckIcon className={styles.icon} />}
      {state === STATE.ERROR && <ErrorIcon className={styles.icon} />}
      {children}
    </div>
  )
});

Snackbar.propTypes = {
  children: PropTypes.string.isRequired,
  state: PropTypes.oneOf([STATE.SUCCESS, STATE.ERROR]).isRequired,
}
