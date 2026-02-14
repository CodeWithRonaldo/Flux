import styles from "./Button.module.css";

const Button = ({ children, variant = "primary", icon, onClick }) => {
  return (
    <button className={`${styles.btn} ${styles[variant]}`} onClick={onClick}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
