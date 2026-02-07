import React from "react";
import styles from "./Form.module.css";

const Form = ({ title, subtitle, onSubmit, children }) => {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.formHeader}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
      {children}
    </form>
  );
};

export default Form;
