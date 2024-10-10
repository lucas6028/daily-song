import Link from 'next/link';
import styles from 'styles/HomeButton.module.css';

interface HomeButtonProps {
  onClick: () => void;
}

export default function HomeButton({ onClick }: HomeButtonProps) {
  return (
    <Link href="/dashboard" type="button" className={styles.homeBtn} onClick={onClick}>
      <strong className={styles.homeBtnText}>DASHBOARD</strong>
      <div className={styles.containerStars}>
        <div className={styles.stars}></div>
      </div>

      <div className={styles.glow}>
        <div className={styles.homeCircle}></div>
        <div className={styles.homeCircle}></div>
      </div>
    </Link>
  );
}
