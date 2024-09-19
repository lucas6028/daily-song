'use client'

import { Zoom, Slide } from 'react-awesome-reveal';
import styles from "./page.module.css";
// import brand from "medium_icon.png";
import HomeButton from '../components/UI/HomeButton';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Home: React.FC = () => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <Zoom triggerOnce>
        <Image
          src='/images/medium_icon.png'
          // src={brand}
          alt="Daily Song"
          fill={true}
          className={styles.image}
        />
      </Zoom>
      <Slide direction="up" triggerOnce>
        <HomeButton onClick={() => router.push('/dashboard')} />
      </Slide>

      <Zoom triggerOnce>
        <p className={styles.text}>
          Display top tracks, recommend tracks, and daily challenge
        </p>
      </Zoom>
    </div>
  );
};

export default Home;