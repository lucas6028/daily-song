import styles from './PlayButton.module.css';
import Image from 'next/image';
import playPhoto from '/images/play-button1.png';

interface PlayButtonProps {
    onClick?: () => void;
}

function PlayButton({ onClick }: PlayButtonProps) {
    return (
        <button className={styles.button} onClick={onClick}>
            <Image src={playPhoto} alt="Play Button" />
        </button>
    );
}

export default PlayButton;