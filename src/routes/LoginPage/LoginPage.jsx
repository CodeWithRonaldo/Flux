import React from "react";
import GlassCard from "../../components/GlassCard/GlassCard";
import Form from "../../components/Form/Form";
import styles from "./LoginPage.module.css";
import Button from "../../components/Button/Button";
import { Link } from "react-router-dom";
import { Wallet } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

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
            <Button variant="btn-primary">Login</Button>
          </div>
          <p className={styles.forgotPassword}>Forgot Password? </p>
          <p className={styles.or}>Or</p>
          <div className={styles.socialLogin}>
            <Button variant="btn-ghost" icon={<FcGoogle />}>
              Sign in with Google
            </Button>
            <Button variant="btn-ghost" icon={<Wallet />}>
              Connect Wallet
            </Button>
          </div>
          <p className={styles.signup}>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </Form>
      </GlassCard>
    </div>
  );
};

export default LoginPage;
