import styles from "./Button.module.css";

const Button = ({ children, variant = "primary", onClick }) => {
  return (
    <button className={`${styles.btn} ${styles[variant]}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
