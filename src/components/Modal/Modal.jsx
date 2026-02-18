import { BlackCard } from "../GlassCard/GlassCard";
import styles from "./Modal.module.css";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className={styles.overlay} onClick={onClose}>
      <BlackCard className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={24} />
        </button>
        {children}
      </BlackCard>
    </div>
  );
};

export default Modal;
