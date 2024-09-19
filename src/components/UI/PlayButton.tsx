import styles from './PlayButton.module.css';
import playPhoto from '/play-button1.png';

interface PlayButtonProps {
    onClick?: () => void;
}

function PlayButton({ onClick }: PlayButtonProps) {
    return (
        <button className={styles.button} onClick={onClick}>
            <img src={playPhoto} alt="Play Button" />
        </button>
    );
}

export default PlayButton;