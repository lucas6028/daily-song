/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { Carousel, Card, Container, Row, Col } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import PlayButton from 'components/UI/PlayButton';
import NavBar from 'components/Layout/Navbar';
import axios from 'axios';
import styles from 'styles/DailySong.module.css';
import spotifyPlayerStyles from 'styles/spotifyPlayerStyle';
import Footer from 'components/Layout/Footer';
import Loading from './loading';
import { useRecommendedTracks } from 'hooks/useRecommendTracks';
import { sleep } from 'lib/sleep';
import { useTopArtist } from 'hooks/useTopArtist';

// Dynamically import SpotifyWebPlayer
const SpotifyWebPlayer = dynamic(() => import('react-spotify-web-playback'), {
  ssr: false, // Disable server-side rendering for this component
  loading: () => <div>Loading player...</div>,
});

function Recommend() {
  const minPopularity = 10;
  const LIMIT = 1;
  const [isReady, setIsReady] = useState<boolean>(false);
  const [uri, setUri] = useState<string>('');
  const [play, setPlay] = useState<boolean>(false);
  const [access_token, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // SWR
  const fetcher = (url: string) => axios.get(url, { withCredentials: true }).then(res => res.data);
  const { data: authData, error: authError } = useSWR('/api/auth', fetcher, {
    revalidateOnFocus: false,
  });
  const { data: tokenData, error: tokenError } = useSWR('/api/auth/token', fetcher, {
    revalidateOnFocus: false,
  });
  const { artists, artistsError } = useTopArtist(LIMIT);
  const { tracks, isLoading, tracksError } = useRecommendedTracks(artists, minPopularity);

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
    if (tokenError) {
      console.error('Error while getting token:', tokenError);
    } else if (tokenData) {
      setAccessToken(tokenData.access_token.value);
    }
  }, [tokenData, tokenError]);

  useEffect(() => {
    setPlay(true);
  }, [uri]);

  useEffect(() => {
    if (!isLoading && !artistsError && isAuthenticated && !tracksError) {
      setIsReady(true);
      sleep(1000);
    }
  }, [isLoading, artistsError, isAuthenticated, tracksError]);

  if (!isReady) {
    return <Loading />;
  }
  if (artistsError) {
    throw new Error(artistsError);
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
            <Carousel.Item key={track.id}>
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
                      <PlayButton onClick={() => setUri(track.trackUri)} />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
      <div className={styles.playerContainer}>
        {access_token ? (
          <SpotifyWebPlayer
            callback={state => {
              if (!state.isPlaying) {
                setPlay(false);
              }
            }}
            showSaveIcon
            play={play}
            token={access_token}
            uris={[uri]}
            initialVolume={50}
            styles={spotifyPlayerStyles}
          />
        ) : (
          <></>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Recommend;
