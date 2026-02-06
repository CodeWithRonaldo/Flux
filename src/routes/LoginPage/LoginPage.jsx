import React from "react";
import GlassCard from "../../components/GlassCard/GlassCard";
import Form from "../../components/Form/Form";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div className={styles.container}>
      <GlassCard>
        <Form
          title="Welcome Back"
          subtitle="Glad you're back!"
          onSubmit={handleSubmit}
        />
        <div className={styles.inputGroup}>
          <input type="username" placeholder="Username" required />
        </div>
        <div className={styles.inputGroup}>
          <input type="password" placeholder="Password" required />
        </div>
        <input type="checkbox" />
      </GlassCard>
    </div>
  );
};

export default LoginPage;
