import styles from './PlayButton.module.css';
import Image from 'next/image';

interface PlayButtonProps {
    onClick?: () => void;
}

function PlayButton({ onClick }: PlayButtonProps) {
    return (
        <button className={styles.button} onClick={onClick}>
            <Image src='/images/play-button1.png' alt="Play Button" />
        </button>
    );
}

export default PlayButton;