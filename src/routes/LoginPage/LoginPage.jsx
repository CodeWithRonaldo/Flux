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
        <Form title="Welcome Back" subtitle="Please enter your credentials to login" onSubmit={handleSubmit} />
        <input type="username" placeholder="Username" required />
      </GlassCard>
    </div>
  );
};

export default LoginPage;
