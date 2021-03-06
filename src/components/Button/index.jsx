import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './styles.module.scss';

export function Button({
  className, children, onClick, primary,
  negative, big, disabled, asText, ...props
}) {
  return (
    <button
      className={cn(
        styles.button,
        primary && styles.primary,
        big && styles.big,
        disabled && styles.disabled,
        negative && styles.negative,
        asText && styles.asText,
        className,
      )}
      onClick={event => {
        if (!disabled) {
          onClick(event);
        }
      }}
      {...props}
    >
      {children}
    </button>
  )
}

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  primary: PropTypes.bool,
  big: PropTypes.bool,
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  primary: true,
  big: false,
  negative: false,
  className: '',
  disabled: false,
};
