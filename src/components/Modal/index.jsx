import React, { useRef } from 'react';
import { CloseIcon } from 'assets/icons';
import styles from './styles.module.scss';
import PropTypes from 'prop-types';

export function Modal({ isOpened, children, onClose, title }) {
  const modalRef = useRef(null);

  function handleContainerClick(event) {
    if (!modalRef.current.contains(event.target)) {
      onClose();
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
        {
          title && (
            <div className={styles.header}>
              <h3 className={styles.title}>{title}</h3>
              <CloseIcon
                className={styles.closeIcon}
                onClick={onClose}
              />
            </div>
          )
        }
        {children}
      </div>
    </div>
  )
}

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  isOpened: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  title: PropTypes.string,
};

Modal.defaultProps = {
  onClose: () => {},
  title: '',
};


