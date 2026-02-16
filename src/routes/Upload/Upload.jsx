import React from "react";
import { GlassCard } from "../../components/GlassCard/GlassCard";
import Form from "../../components/Form/Form";
import styles from "./Upload.module.css";

const Upload = () => {
  return (
    <div className={styles.UploadContainer}>
      <GlassCard>
        <Form title={"Upload Page"}></Form>
      </GlassCard>
    </div>
  );
};

export default Upload;
