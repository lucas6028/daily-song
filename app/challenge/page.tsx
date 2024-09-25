'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Form } from 'react-bootstrap';
import axios from 'axios';
// import Loading from "../ui/loading/Loading";
import SpotifyWebPlayer from 'react-spotify-web-playback';
import spotifyPlayerStyles from 'styles/spotifyPlayerStyle';
// import PlayButton from "components/UI/PlayButton";
import styles from 'styles/Challenge.module.css';
import { Artist, SpotifyArtistResponse, SpotifyTracksResponse, Track } from 'types/types';
import NavBar from 'components/Layout/Navbar';
import { compareNames, trimName } from 'lib/name';
import Footer from 'components/Layout/Footer';

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

  useEffect(() => {
    setPlay(true);
  }, [uri]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/auth', { withCredentials: true });

        if (response.data.authenticated) {
          // User is authenticated (either access token is valid or refreshed)
          setIsAuthenticated(true);
        } else {
          // No access token, no refresh token, or refresh failed
          console.log(response.data.message);
          router.push('/login');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        router.push('/login');
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await axios.get('/api/auth/token', { withCredentials: true });
        setAccessToken(res.data.access_token.value);
      } catch (err) {
        console.error('Error while get token: ' + err);
      }
    };

    const fetchTopArtists = async () => {
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
          popularity: art.popularity,
          uri: art.uri,
          imgUrl: art.images[1].url,
        }));
        setArtists(newArtists);
      } catch (err) {
        console.error('Error while fetching top artists: ' + err);
        setError('Failed to fetch top artists');
      }
    };

    fetchToken();
    fetchTopArtists();
  }, []);

  useEffect(() => {
    const fetchRelatedArtists = async () => {
      if (artists.length === 0) return;

      try {
        const res = await axios.get('/api/artist/related', {
          params: {
            id: artists[0].id,
          },
          withCredentials: true,
        });
        const newRelatedArtists: Artist[] = res.data.body.artists.map(
          (art: SpotifyArtistResponse) => ({
            name: art.name,
            id: art.id,
            popularity: art.popularity,
            uri: art.uri,
            imgUrl: art.images[1].url,
          })
        );
        setRelatedArtists(newRelatedArtists);
      } catch (err) {
        console.error('Error while get related artists: ' + err);
      }
    };

    const fetchArtistTopTracks = async () => {
      if (artists.length === 0) return;

      try {
        const res = await axios.get<SpotifyTracksResponse>('/api/artist/top-tracks', {
          params: {
            id: artists[0].id,
            market: 'TW',
          },
          withCredentials: true,
        });
        console.log('Top tracks');
        console.log(res);
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

    fetchRelatedArtists();
    fetchArtistTopTracks();
  }, [artists]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimTrackName = trimName(tracks[0].title);
    const trimSelectedTrackName = trimName(selectedTrack);
    if (compareNames(trimTrackName, trimSelectedTrackName)) {
      if (tracks[0].artist === selectedArtists) {
        console.log('Flip card!');
        setIsFlipped(true);
      } else {
        console.log('The artist name is wrong...');
      }
    } else {
      console.log('The track name is correct!');
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
    return (
      // <Loading />
      <p>loading</p>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
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
                      <option value={tracks[0].artist}>{tracks[0].artist}</option>
                      <option value={relatedArtists[0].name}>{relatedArtists[0].name}</option>
                      <option value={relatedArtists[1].name}>{relatedArtists[1].name}</option>
                      <option value={relatedArtists[2].name}>{relatedArtists[2].name}</option>
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
                      onClick={() => setUri(tracks[0].trackUri)}
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
                src={tracks[0].img}
                alt="Track cover"
                className="rounded-circle mx-auto mt-3 profile-img"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
              <Card.Body className="text-center p-4">
                <Card.Title>{tracks[0].title}</Card.Title>
                <Card.Subtitle className="mb-3">{tracks[0].artist}</Card.Subtitle>
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
          <p>No token</p>
        )}
      </div>

      <Footer />
    </>
  );
}

export default Challenge;
