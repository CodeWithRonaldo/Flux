import styles from "./StateDisplay.module.css";

export const LoadingState = ({ message = "Loading..." }) => (
  <div className={styles.container}>
    <div className={styles.spinner} />
    <p className={styles.message}>{message}</p>
  </div>
);

export const EmptyState = ({ icon, title, description }) => (
  <div className={styles.container}>
    {icon && <div className={styles.icon}>{icon}</div>}
    <h3 className={styles.title}>{title}</h3>
    {description && <p className={styles.message}>{description}</p>}
  </div>
);

export const ErrorState = ({ title, description }) => (
  <div className={styles.container}>
    <div className={styles.errorIcon}>!</div>
    <h3 className={styles.title}>{title}</h3>
    {description && <p className={styles.message}>{description}</p>}
  </div>
);
