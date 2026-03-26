import { Music } from "lucide-react";
import styles from "./TransactionLoader.module.css";

const TransactionLoader = ({
  icon = <Music size={32} />,
  title,
  subtitle = "Confirming on IOTA blockchain",
}) => (
  <div className={styles.container}>
    <div className={styles.orb}>
      <div className={styles.ring} />
      <div className={styles.ring} />
      <div className={styles.ring} />
      <div className={styles.icon}>{icon}</div>
    </div>
    <h2 className={styles.title}>{title}</h2>
    <p className={styles.subtitle}>
      {subtitle}
      <span className={styles.dots} />
    </p>
  </div>
);

export default TransactionLoader;
