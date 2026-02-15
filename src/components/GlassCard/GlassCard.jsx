import styles from "./GlassCard.module.css";

export const GlassCard = ({ children, className }) => {
  return (
    <div className={`${styles.glassCard} ${className || ""}`}>{children}</div>
  );
};

export const PlainCard = ({ children, className }) => {
  return (
    <div className={`${styles.plainCard} ${className || ""}`}>{children}</div>
  );
};

export const BlackCard = ({ children, className }) => {
  return (
    <div className={`${styles.blackCard} ${className || ""}`}>{children}</div>
  );
};
