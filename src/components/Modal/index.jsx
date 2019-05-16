import React, { useRef } from 'react';
import styles from './styles.module.scss';
import PropTypes from 'prop-types';

export function Modal({ isOpened, children, onOutsideClick }) {
  const modalRef = useRef(null);

  function handleContainerClick(event) {
    if (!modalRef.current.contains(event.target)) {
      onOutsideClick();
    }
  }

  if (!isOpened) {
    return null;
  }

  return (
    <div
      onClick={handleContainerClick}
      className={styles.modalContainer}
    >
      <div
        ref={modalRef}
        className={styles.modal}
      >
        {children}
      </div>
    </div>
  )
}

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  isOpened: PropTypes.bool.isRequired,
  onOutsideClick: PropTypes.func,
};

Modal.defaultProps = {
  onOutsideClick: () => {},
};


