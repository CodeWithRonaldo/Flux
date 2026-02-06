import styles from "./GlassCard.module.css";

const GlassCard = ({ children, header, paragraph }) => {
  return (
    <div className={styles.glassCard}>
      <h1>{header}</h1>
      <p>{paragraph}</p>
      {children}
    </div>
  );
};

export default GlassCard;
