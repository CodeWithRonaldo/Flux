import styles from "./Button.module.css";

const Button = ({
  children,
  variant = "btn-primary",
  icon,
  onClick,
  disabled,
  type = "button",
  className = "",
}) => {
  return (
    <button
      type={type}
      className={`${styles.btn} ${styles[variant]} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
