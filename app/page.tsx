'use client';

import { Zoom, Slide } from 'react-awesome-reveal';
import Image from 'next/image';
import styles from 'styles/Home.module.css';
import HomeButton from 'components/UI/HomeButton';
import Footer from 'components/Layout/Footer';

const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <Zoom triggerOnce>
        <Image
          src="/images/medium_icon.png"
          alt="Daily Song"
          width={237}
          height={203}
          className={styles.image}
        />
      </Zoom>
      <Slide direction="up" triggerOnce>
        <HomeButton onClick={() => console.log('Navigate to dashboard')} />
      </Slide>

      <Zoom triggerOnce>
        <p className={styles.text}>Display top tracks, recommend tracks, and daily challenge</p>
      </Zoom>
      <p> </p>
      <Footer />
    </div>
  );
};

export default Home;
