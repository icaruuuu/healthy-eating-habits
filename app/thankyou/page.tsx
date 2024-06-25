"use client";
import React from 'react';
import styles from './ThankYouPage.module.css'; // Import styles

const ThankYouPage = () => {
  return (
    <div className={styles.thankYouContainer}>
      <div className={styles.card}>
        <div className={styles.greenLine}></div> {/* Green line on top */}
        <h2>Thank You!</h2>
        <hr className={styles.titleLine} />
        <p>We appreciate your time and effort in taking this survey. Your response has been recorded and will help us greatly.</p>
      </div>
    </div>
  );
};

export default ThankYouPage;
