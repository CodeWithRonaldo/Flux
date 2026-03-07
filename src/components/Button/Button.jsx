import styles from "./Button.module.css";

const Button = ({
  children,
  variant = "btn-primary",
  icon,
  onClick,
  disabled,
}) => {
  return (
    <button
      className={`${styles.btn} ${styles[variant]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
