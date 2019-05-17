import React, { useState } from 'react';
import cn from 'classnames';
import styles from './styles.module.scss';

export function Input({
  name, value, onChange, label, containerStyles,
  invalid, onAfterTouch, simple, ...props
}) {
  const [isActive, setIsActive] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const activate = () => {
    setIsActive(true);
  };

  const disactivate = () => {
    if (!isTouched) {
      onAfterTouch();
      setIsTouched(true);
    }

    setIsActive(false);
  };


  return (
    <div className={cn(
      styles.container,
      containerStyles,
    )}>
      {
        label && (
          <span className={cn(
              styles.label,
              (isActive || value || simple) && styles.raisedLabel,
              isActive && styles.forActiveLabel,
              (invalid && !isActive) && styles.forInvalidLabel,
            )}>
            {label}
          </span>
        )
      }
      <input
        className={cn(
          styles.input,
          isActive && styles.activeInput,
          (invalid && !isActive) && styles.invalidInput,
          simple && styles.simpleInput,
        )}
        type="text"
        name={name}
        value={value}
        onChange={event => onChange(event.target.value)}
        onFocus={activate}
        onBlur={disactivate}
        {...props}
      />
    </div>
  );
}

Input.defaultProps = {
  onAfterTouch: () => {},
};
