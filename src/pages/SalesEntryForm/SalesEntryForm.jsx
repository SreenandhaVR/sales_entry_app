import React from "react";
import styles from "./SalesEntryForm.module.scss";

const SalesEntryForm = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Sales Entry</h1>
      <div className={styles.card}>
        <h2>Header Section</h2>
      </div>
      <div className={styles.card}>
        <h2>Detail Section</h2>
      </div>
    </div>
  );
};

export default SalesEntryForm;
