import styles from "./GlassCard.module.css";

const GlassCard = ({ children }) => {
  return (
    <div className={styles.glassCard}>
      
      {children}
    </div>
  );
};

export default GlassCard;
