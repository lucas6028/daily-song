import styles from "./HomeButton.module.css";

interface HomeButtonProps {
    onClick: () => void;
}

export default function HomeButton({ onClick }: HomeButtonProps) {
    return (
        <button type="button" className={styles.homeBtn} onClick={onClick}>
            <strong className={styles.homeBtnText}>DASHBOARD</strong>
            <div className={styles.containerStars}>
                <div className={styles.stars}></div>
            </div>

            <div className={styles.glow}>
                <div className={styles.homeCircle}></div>
                <div className={styles.homeCircle}></div>
            </div>
        </button>
    );
}