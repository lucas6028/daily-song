'use client'

import { Carousel, Container, Card, Row, Col } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { SpotifyItemsResponse, Track } from "types/types";
import axios from "axios";
// import Loading from "../ui/loading/Loading";
import SpotifyWebPlayer from "react-spotify-web-playback";
import PlayButton from 'components/UI/PlayButton';
import NavBar from 'components/Layout/Navbar';
import styles from "styles/TopTracks.module.css";
import spotifyPlayerStyles from 'styles/spotifyPlayerStyle';
import Footer from 'components/Layout/Footer';

function TopTrack() {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [uri, setUri] = useState<string>("");
    const [play, setPlay] = useState<boolean>(false);
    const [access_token, setAccessToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

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
                    router.push("/login");
                }
            } catch (error) {
                console.error("Error checking auth status:", error);
                router.push("/login");
            }
        };

        checkAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCardClick = (newUri: string) => {
        setUri(newUri);
    }

    useEffect(() => {
        setPlay(true);
    }, [uri]);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const res = await axios.get('/api/auth/token', { withCredentials: true });
                setAccessToken(res.data.access_token);
            } catch (err) {
                console.error("Error while get token: " + err);
            }
        }
        const fetchTopTracks = async () => {
            try {
                const res = await axios.get<SpotifyItemsResponse>('/api/track/my-top', {
                    params: {
                        limit: 10,
                    },
                    withCredentials: true,
                });
                const newTracks = res.data.body.items.map((track) => ({
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
            } catch (err) {
                console.error(err);
                setError("Failed to fetch top tracks.");
            } finally {
                setLoading(false);
            }
        };

        fetchToken();
        fetchTopTracks();
    }, []);

    if (!isAuthenticated || loading) {
        // return <Loading></Loading>;
        return <p>Loading</p>
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <>
            <NavBar />
            <Container className="my-1">
                <Carousel>
                    {tracks.map((track) => (
                        <Carousel.Item key={track.id}>
                            <Row className="justify-content-center">
                                <Col xs={10} sm={8} md={6} lg={4}>
                                    <Card className="bg-secondary bg-gradient text-dark">
                                        <Card.Img variant="top" src={track.img} />
                                        <Card.Body className="d-flex flex-column align-items-center">
                                            <Card.Title>{track.title}</Card.Title>
                                            <Card.Text>{track.artist}</Card.Text>
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
                {access_token ?
                    <SpotifyWebPlayer callback={(state) => {
                        if (!state.isPlaying) {
                            setPlay(false);
                        }
                    }}
                        showSaveIcon
                        play={play}
                        token={access_token}
                        uris={[uri]}
                        initialVolume={50}
                        styles={spotifyPlayerStyles} />
                    :
                    <p>No token</p>
                }
            </div>
            <Footer />
        </>
    );
}

export default TopTrack;