import styles from './Loading.module.css';

function Loading() {
    return (
        /* From Uiverse.io by mobinkakei */
        <div className={styles.parent}>
            <div className={styles.wrapper}>
                <div className={styles.circle}></div>
                <div className={styles.circle}></div>
                <div className={styles.circle}></div>
                <div className={styles.circle}></div>
                <div className={styles.circle}></div>
                <div className={styles.circle}></div>
            </div>
        </div>
    )
}

export default Loading