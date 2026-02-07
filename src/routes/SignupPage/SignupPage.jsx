import React from "react";
import GlassCard from "../../components/GlassCard/GlassCard";
import Form from "../../components/Form/Form";
import styles from "./SignupPage.module.css";
import Button from "../../components/Button/Button";
import { Link } from "react-router-dom";

const SignupPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div className={styles.container}>
      <GlassCard>
        <Form
          title="Create Account"
          subtitle="Join us today!"
          onSubmit={handleSubmit}
        />
        <div className={styles.inputGroup}>
          <input type="text" placeholder="Username" required />
        </div>
        <div className={styles.inputGroup}>
          <input type="email" placeholder="Email" required />
        </div>
        <div className={styles.inputGroup}>
          <input type="password" placeholder="Password" required />
        </div>
        <div className={styles.inputGroup}>
          <input type="password" placeholder="Confirm Password" required />
        </div>
        <div className={styles.terms}>
          <input type="checkbox" required />
          <label>I agree to the Terms and Conditions</label>
        </div>
        <div className={styles.signupButton}>
          <Button variant="primary">Sign Up</Button>
        </div>
        <p className={styles.login}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </GlassCard>
    </div>
  );
};

export default SignupPage;
