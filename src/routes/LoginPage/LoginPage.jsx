import React from "react";
import GlassCard from "../../components/GlassCard/GlassCard";
import Form from "../../components/Form/Form";
import styles from "./LoginPage.module.css";
import Button from "../../components/Button/Button";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div className={styles.loginContainer}>
      <GlassCard className={styles.loginCard}>
        <Form
          title="Welcome Back"
          subtitle="Glad you're back!"
          onSubmit={handleSubmit}
        >
          <div className={styles.inputGroup}>
            <input type="username" placeholder="Username" required />
          </div>
          <div className={styles.inputGroup}>
            <input type="password" placeholder="Password" required />
          </div>
          <div className={styles.remember}>
            <input type="checkbox" />
            <label>Remember me</label>
          </div>
          <div className={styles.loginButton}>
            <Button variant="primary">Login</Button>
          </div>
          <p className={styles.forgotPassword}>Forgot Password? </p>
          <p className={styles.signup}>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </Form>
      </GlassCard>
    </div>
  );
};

export default LoginPage;
