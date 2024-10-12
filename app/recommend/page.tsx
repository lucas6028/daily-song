/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { Carousel, Card, Container, Row, Col } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Artist, SpotifyArtistResponse, SpotifyTracksResponse, Track } from 'types/types';
import { useRouter } from 'next/navigation';
import SpotifyWebPlayer from 'react-spotify-web-playback';
import PlayButton from 'components/UI/PlayButton';
import NavBar from 'components/Layout/Navbar';
import axios from 'axios';
import styles from 'styles/DailySong.module.css';
import spotifyPlayerStyles from 'styles/spotifyPlayerStyle';
import Footer from 'components/Layout/Footer';
import Loading from './loading';

function Recommend() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [uri, setUri] = useState<string>('');
  const [play, setPlay] = useState<boolean>(false);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [access_token, setAccessToken] = useState<string | null>(null);
  const minPopularity = 10;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // SWR
  const fetcher = (url: string) => axios.get(url, { withCredentials: true }).then(res => res.data);
  const { data: authData, error: authError } = useSWR('/api/auth', fetcher);
  const { data: tokenData, error: tokenError } = useSWR('/api/auth/token', fetcher);

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
    if (!access_token) return;

    const fetchTopArtists = async () => {
      try {
        const res = await axios.get('/api/artist/my-top', {
          params: {
            limit: 1,
            offset: Math.floor(Math.random() * 21),
          },
          withCredentials: true,
        });

        const newArtists: Artist[] = res.data.body.items.map((art: SpotifyArtistResponse) => ({
          name: art.name,
          id: art.id,
          popularity: art.popularity,
          uri: art.uri,
          imgUrl: art.images[1].url,
        }));
        setArtists(newArtists);
      } catch (err) {
        console.error('Error while fetching top artists: ' + err);
        setError('Failed to fetch top artists');
        setLoading(false);
      }
    };

    fetchTopArtists();
  }, [access_token]);

  useEffect(() => {
    const fetchRecommendTracks = async () => {
      if (artists.length === 0) return;

      try {
        const res = await axios.get<SpotifyTracksResponse>('/api/track/recommend', {
          params: {
            limit: 10,
            seed_artists: artists[0].id,
            // seed_genres: seedGenres,
            min_popularity: minPopularity,
          },
          withCredentials: true,
        });
        const newTracks: Track[] = res.data.body.tracks.map(track => ({
          albumName: track.album.name,
          albumUri: track.album.uri,
          artist: track.artists[0].name,
          artistUri: track.artists[0].uri,
          title: track.name,
          id: track.id,
          trackUri: track.uri,
          img: track.album.images[1].url,
        }));

        setTracks(newTracks);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch recommended tracks');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendTracks();
  }, [artists]);

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
          <p>No token!</p>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Recommend;
