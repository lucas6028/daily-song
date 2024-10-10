'use client';

import { useEffect } from 'react';
import styles from 'styles/error.module.css';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className={styles.title}>Oops! Something went wrong</h2>
        <p className={styles.message}>
          {error.message || "We're sorry, but an unexpected error occurred."}
        </p>
        <button onClick={() => reset()} className={styles.button}>
          Try again
        </button>
        <p className={styles.supportText}>
          If the problem persists, please contact our support team.
        </p>
      </div>
      <div className={styles.backgroundPattern}></div>
    </div>
  );
}
