'use client';

import { GoogleAnalytics } from '@next/third-parties/google';
import { useRouter } from 'next/navigation';
import { Zoom, Slide } from 'react-awesome-reveal';
import Image from 'next/image';
import styles from 'styles/Home.module.css';
// import brand from "medium_icon.png";
import HomeButton from 'components/UI/HomeButton';
import Footer from 'components/Layout/Footer';

const Home: React.FC = () => {
  const router = useRouter();

  return (
    <>
      <GoogleAnalytics gaId="G-0RRDH6KHKD" />
      <div className={styles.container}>
        <Zoom triggerOnce>
          <Image
            src="/images/medium_icon.png"
            // src={brand}
            alt="Daily Song"
            width={237}
            height={203}
            className={styles.image}
          />
        </Zoom>
        <Slide direction="up" triggerOnce>
          <HomeButton onClick={() => router.push('/dashboard')} />
        </Slide>

        <Zoom triggerOnce>
          <p className={styles.text}>Display top tracks, recommend tracks, and daily challenge</p>
        </Zoom>
        <Footer />
      </div>
    </>
  );
};

export default Home;
