import React from 'react';
import styles from 'styles/Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer>
      <div>
        <p className={styles.text}>&copy; 2024 Hao-Ping Chen. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
