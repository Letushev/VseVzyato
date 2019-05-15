import React, { useState } from 'react';
import cn from 'classnames';
import styles from './styles.module.scss';

export function Input({
  name, value, onChange, label, containerStyles,
  invalid, startValidating, ...props
}) {
  const [isActive, setIsActive] = useState(false);
  const [wasTouched, setWasTouched] = useState(false);

  const activate = () => {
    setIsActive(true);
  };

  const disactivate = () => {
    setIsActive(false);

    if (!wasTouched) {
      setWasTouched(true);
      startValidating();
    }
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
              (isActive || value) && styles.raisedLabel,
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
        )}
        type="text"
        name={name}
        value={value}
        onChange={event => onChange(event.target.value.trim())}
        onFocus={activate}
        onBlur={disactivate}
        {...props}
      />
    </div>
  );
}
