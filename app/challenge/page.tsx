/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { Button, Card, Container, Form } from 'react-bootstrap';
import axios from 'axios';
import SpotifyWebPlayer from 'react-spotify-web-playback';
import spotifyPlayerStyles from 'styles/spotifyPlayerStyle';
import styles from 'styles/Challenge.module.css';
import {
  Artist,
  LastfmArtist,
  SpotifyArtistResponse,
  SpotifyTracksResponse,
  Track,
} from 'types/types';
import NavBar from 'components/Layout/Navbar';
import { compareNames, trimName } from 'lib/name';
import Footer from 'components/Layout/Footer';
import Loading from './loading';
import shuffleArray from 'lib/suffleArray';
import FixingPage from 'components/Layout/FixingPage';

function Challenge() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [access_token, setAccessToken] = useState<string | null>(null);
  const [play, setPlay] = useState<boolean>(false);
  const [uri, setUri] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<string>('');
  const [selectedArtists, setSelectedArtists] = useState<string>('');
  const [relatedArtists, setRelatedArtists] = useState<Artist[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const router = useRouter();
  const trackIndex = Math.floor(Math.random() * 9);

  // SWR
  const fetcher = (url: string) => axios.get(url, { withCredentials: true }).then(res => res.data);
  const { data: authData, error: authError } = useSWR('/api/auth', fetcher);
  const { data: tokenData, error: tokenError } = useSWR('/api/auth/token', fetcher);

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

  useEffect(() => {
    const fetchTopArtists = async () => {
      if (!access_token) return;

      try {
        const res = await axios.get('/api/artist/my-top', {
          params: {
            limit: 1,
            offset: Math.floor(Math.random() * 51),
          },
          withCredentials: true,
        });
        const newArtists: Artist[] = res.data.body.items.map((art: SpotifyArtistResponse) => ({
          name: art.name,
          id: art.id,
          uri: art.uri,
        }));
        setArtists(newArtists);
      } catch (err) {
        console.error('Error while fetching top artists: ' + err);
        setError('Failed to fetch top artists');
      }
    };

    fetchTopArtists();
  }, [access_token]);

  useEffect(() => {
    const fetchRelatedArtists = async () => {
      if (artists.length === 0) return;

      try {
        const res = await axios.get('/api/artist/related', {
          params: {
            seed_artist: artists[0].name,
            limit: 3,
          },
          withCredentials: true,
        });
        const newRelatedArtists: Artist[] = res.data.artists.map((art: LastfmArtist) => ({
          name: art.name,
          id: art.mbid,
          uri: art.url,
        }));
        // console.log('artists: ' + artists.map(art => art.name));
        // console.log('new related artists: ' + newRelatedArtists.map(art => art.name));
        setRelatedArtists(shuffleArray([...artists, ...newRelatedArtists]));
        // console.log('related artists: ' + relatedArtists.map(art => art.name));
      } catch (err) {
        console.error('Error while get related artists: ' + err);
      }
    };

    fetchRelatedArtists();
  }, [artists]);

  useEffect(() => {
    const fetchArtistTopTracks = async () => {
      if (relatedArtists.length === 0) return;

      let answerIndex = 0;
      for (let i = 0; i < relatedArtists.length; i++) {
        if (relatedArtists[i].name === artists[0].name) {
          answerIndex = i;
          break;
        }
      }

      // console.log('answerIndex:' + answerIndex);
      // console.log('answer artist: ' + relatedArtists[answerIndex].name);

      try {
        const res = await axios.get<SpotifyTracksResponse>('/api/artist/top-tracks', {
          params: {
            id: relatedArtists[answerIndex].id,
            market: 'TW',
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
      }
    };

    fetchArtistTopTracks();
  }, [relatedArtists]);

  useEffect(() => {
    if (tracks.length === 0) return;
    setUri(tracks[trackIndex].trackUri);
  }, [tracks]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimTrackName = trimName(tracks[trackIndex].title);
    const trimSelectedTrackName = trimName(selectedTrack);

    if (compareNames(trimTrackName, trimSelectedTrackName)) {
      if (tracks[trackIndex].artist === selectedArtists) {
        console.log('Flip card!');
        setIsFlipped(true);
      } else {
        console.log('The artist name is wrong...');
      }
    } else {
      console.log('The track name is wrong!');
    }
  };

  const handleTrackChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSelectedTrack(value);
  };

  const handleSingerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setSelectedArtists(value);
  };

  if (
    !isAuthenticated ||
    artists.length === 0 ||
    relatedArtists.length === 0 ||
    tracks.length === 0
  ) {
    return <Loading />;
  }

  if (error) {
    throw new Error(error);
  }

  if (relatedArtists.length < 4) {
    return <FixingPage messages={['There are some errors.', 'Please reload the page!']} />;
  }

  return (
    <>
      <Container className="mx-auto p-2">
        <NavBar />
        <div className={`${styles.cardContainer} ${isFlipped ? styles.flipped : ''}`}>
          <div className={`d-flex justify-content-center mt-4 ${styles.cardInner}`}>
            {/* Front Side */}
            <div className={`d-flex justify-content-center mt-4 ${styles.Front}`}>
              <Card className={`shadow-lg text-light rounded-3 profile-card ${styles.card}`}>
                <Card.Body className="p-4">
                  <Form onSubmit={handleSubmit}>
                    <h5 className="text-center mb-4">Music Selection</h5>

                    {/* Song Input */}
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Label>Song</Form.Label>
                      <Form.Control
                        placeholder="Enter song name..."
                        onChange={handleTrackChange}
                        value={selectedTrack}
                        className="border-dark"
                      />
                    </Form.Group>

                    {/* Singer Select */}
                    <Form.Group className="mb-3" controlId="formSelect">
                      <Form.Label>Singer</Form.Label>
                      <Form.Select
                        value={selectedArtists}
                        onChange={handleSingerChange}
                        className="border-dark"
                      >
                        <option value="" disabled hidden>
                          Select an artist...
                        </option>
                        <option value={relatedArtists[0].name}>{relatedArtists[0].name}</option>
                        <option value={relatedArtists[1].name}>{relatedArtists[1].name}</option>
                        <option value={relatedArtists[2].name}>{relatedArtists[2].name}</option>
                        <option value={relatedArtists[3].name}>{relatedArtists[3].name}</option>
                      </Form.Select>
                    </Form.Group>

                    {/* Button Group */}
                    <div className="d-flex justify-content-between mt-4">
                      <Button
                        variant="info"
                        className={`w-100 me-2 ${styles.frontButtonColor}`}
                        type="submit"
                      >
                        Submit
                      </Button>
                      <Button
                        variant="info"
                        className={`w-100 me-2 ${styles.frontButtonColor}`}
                        onClick={() => setPlay(!play)}
                      >
                        Play
                      </Button>
                      <Button
                        variant="info"
                        className={`w-100 me-2 ${styles.frontButtonColor}`}
                        onClick={() => setIsFlipped(!isFlipped)}
                      >
                        Answer
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </div>

            {/* Back Side */}
            <div className={`d-flex justify-content-center mt-4 ${styles.cardBack}`}>
              <Card className={`shadow-lg text-light rounded-3 profile-card ${styles.card}`}>
                <Card.Img
                  src={tracks[trackIndex].img}
                  alt="Track cover"
                  className="rounded-circle mx-auto mt-3 profile-img"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
                <Card.Body className="text-center p-4">
                  <Card.Title>{tracks[trackIndex].title}</Card.Title>
                  <Card.Subtitle className="mb-3">{tracks[trackIndex].artist}</Card.Subtitle>
                  <Button
                    variant="info"
                    className={`w-100 ${styles.frontButtonColor}`}
                    onClick={() => setIsVisible(!isVisible)}
                  >
                    Show Player
                  </Button>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
        {/* Spotify Player */}
        <div
          className={`${isVisible ? styles.visible : styles.hidden} ${styles.playerContainer} mt-3`}
        >
          {access_token ? (
            <SpotifyWebPlayer
              callback={state => {
                if (!state.isPlaying) setPlay(false);
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
      </Container>
      <Footer />
    </>
  );
}

export default Challenge;
