/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { Carousel, Card, Container, Row, Col } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import PlayButton from 'components/UI/PlayButton';
import NavBar from 'components/Layout/Navbar';
import axios from 'axios';
import styles from 'styles/DailySong.module.css';
import Footer from 'components/Layout/Footer';
import Loading from './loading';
import { useRecommendedTracks } from 'hooks/useRecommendTracks';
import { sleep } from 'lib/sleep';

function Recommend() {
  const LIMIT = 10;
  const OFFSET = Math.floor(Math.random() * 21);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // SWR
  const fetcher = (url: string) => axios.get(url, { withCredentials: true }).then(res => res.data);
  const { data: authData, error: authError } = useSWR('/api/auth', fetcher, {
    revalidateOnFocus: false,
  });
  const { tracks, isLoading, tracksError } = useRecommendedTracks(
    'Paz8PyxaWKr82o2PlV',
    'TW',
    LIMIT,
    OFFSET
  );

  useEffect(() => {
    if (authError) {
      console.error('Error checking auth status:', authError);
      router.push('/login');
    } else if (authData && !authData.authenticated) {
      router.push('/login');
    } else if (authData && authData.authenticated) {
      setIsAuthenticated(true);
    }
  }, [authData, authError]);

  useEffect(() => {
    if (!isLoading && !topTracksError && isAuthenticated && !tracksError) {
      setIsReady(true);
      sleep(1000);
    }
  }, [isLoading, topTracksError, isAuthenticated, tracksError]);

  if (!isReady) {
    return <Loading />;
  }
  if (topTracksError) {
    throw new Error(topTracksError);
  }
  if (tracksError) {
    throw new Error(tracksError);
  }

  return (
    <>
      <Container className="my-1">
        <NavBar />
        <Carousel>
          {tracks.map(track => (
            <Carousel.Item key={track.title}>
              <Row className="justify-content-center">
                <Col xs={12} md={6} lg={4}>
                  <Card className={`bg-gradient text-dark ${styles.card}`}>
                    <Card.Img
                      variant="top"
                      src={track.img}
                      width={300}
                      height={300}
                      style={{ objectFit: 'contain' }}
                    />
                    <Card.Body className="d-flex flex-column align-items-center">
                      <Card.Title className={styles.text}>{track.title}</Card.Title>
                      <Card.Text className={styles.text}>{track.artist}</Card.Text>
                      <PlayButton onClick={() => (window.location.href = `${track.trackUri}`)} />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
      <Footer />
    </>
  );
}

export default Recommend;
