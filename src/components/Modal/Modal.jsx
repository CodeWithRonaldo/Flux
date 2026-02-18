import React from 'react'
import { BlackCard } from '../GlassCard/GlassCard';
import styles from './Modal.module.css';

const Modal = ({isOpen, onClose, children}) => {
    if (!isOpen) return null;
  return (
    <div className={styles.overlay} onClick={onClose}>
        <BlackCard className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={onClose}>X</button>
            {children}
        </BlackCard>
    </div>
  )
}

export default Modal