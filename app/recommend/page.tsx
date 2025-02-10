'use client';

import { Carousel, Card, Container, Row, Col } from 'react-bootstrap';
import { useEffect } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import PlayButton from 'components/UI/PlayButton';
import NavBar from 'components/Layout/Navbar';
import axios from 'axios';
import Footer from 'components/Layout/Footer';
import Loading from './loading';
import styles from 'styles/DailySong.module.css';
import { useRecommendedTracks } from 'hooks/useRecommendTracks';

function Recommend() {
  const LIMIT = 10;
  const OFFSET = Math.floor(Math.random() * 21);
  const router = useRouter();

  // Fetch auth status
  const fetcher = (url: string) => axios.get(url, { withCredentials: true }).then(res => res.data);
  const { data: authData, error: authError } = useSWR('/api/auth', fetcher, {
    revalidateOnFocus: false,
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (authError || (authData && !authData.authenticated)) {
      router.push('/login');
    }
  }, [authData, authError, router]);

  // Only request recommended tracks if authenticated
  const { tracks, isLoading, tracksError } = useRecommendedTracks(
    authData && authData.authenticated ? 'Paz8PyxaWKr82o2PlV' : '',
    'TW',
    LIMIT,
    OFFSET
  );

  // Show loading until auth and track data are ready
  if (!authData || isLoading || !authData.authenticated) {
    return <Loading />;
  }
  if (tracksError) {
    throw new Error(tracksError);
  }

  return (
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
      <Footer />
    </Container>
  );
}

export default Recommend;
