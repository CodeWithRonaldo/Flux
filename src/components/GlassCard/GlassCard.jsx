import styles from "./GlassCard.module.css";

export const GlassCard = ({ children, className }) => {
  return (
    <div className={`${styles.glassCard} ${className || ""}`}>{children}</div>
  );
};

export const plainCard = ({ children, className }) => {
  return (
    <div className={`${styles.plainCard} ${className || ""}`}>{children}</div>
  );
};
