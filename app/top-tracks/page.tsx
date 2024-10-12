/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { Carousel, Container, Card, Row, Col } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { Track, TrackItem } from 'types/types';
import axios from 'axios';
import SpotifyWebPlayer from 'react-spotify-web-playback';
import PlayButton from 'components/UI/PlayButton';
import NavBar from 'components/Layout/Navbar';
import styles from 'styles/TopTracks.module.css';
import spotifyPlayerStyles from 'styles/spotifyPlayerStyle';
import Footer from 'components/Layout/Footer';
import Loading from './loading';

function TopTrack() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [uri, setUri] = useState<string>('');
  const [play, setPlay] = useState<boolean>(false);
  const [access_token, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // SWR
  const fetcher = (url: string) => axios.get(url, { withCredentials: true }).then(res => res.data);
  const { data: authData, error: authError } = useSWR('/api/auth', fetcher);
  const { data: tokenData, error: tokenError } = useSWR('/api/auth/token', fetcher);
  const { data: tracksData, error: tracksError } = useSWR('/api/track/my-top', (url: string) =>
    axios
      .get(url, {
        params: { limit: 10 },
        withCredentials: true,
      })
      .then(res => res.data.body.items)
  );

  useEffect(() => {
    setPlay(true);
  }, [uri]);

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
      throw new Error(tokenError);
    } else if (tokenData) {
      setAccessToken(tokenData.access_token.value);
    }
  }, [tokenData, tokenError]);

  const handleCardClick = (newUri: string) => {
    setUri(newUri);
  };

  useEffect(() => {
    setPlay(true);
  }, [uri]);

  useEffect(() => {
    if (tracksError) {
      console.error('Error fetching top tracks:', tracksError);
      setError('Failed to fetch top tracks');
    } else if (tracksData) {
      const newTracks = tracksData.map((track: TrackItem) => ({
        albumName: track.album.name,
        albumUri: track.album.uri,
        img: track.album.images[1].url,
        artist: track.artists[0].name,
        artistUri: track.artists[0].uri,
        title: track.name,
        id: track.id,
        trackUri: track.uri,
      }));
      setTracks(newTracks);
    }
    setLoading(false);
  }, [tracksData, tracksError]);

  if (!isAuthenticated || loading) {
    return <Loading />;
  }

  if (error) {
    throw new Error(error);
  }

  return (
    <>
      <Container className="my-1">
        <NavBar />
        <Carousel>
          {tracks.map(track => (
            <Carousel.Item key={track.id}>
              <Row className="justify-content-center">
                <Col xs={10} sm={8} md={6} lg={4}>
                  <Card className={`bg-gradient ${styles.card}`}>
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
                      <PlayButton onClick={() => handleCardClick(track.trackUri)} />
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

export default TopTrack;
