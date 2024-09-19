'use client';

import { useState, useEffect } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { useRouter } from "next/navigation";
import axios from "axios";
// import Hamster from "../ui/hamster/Hamster";
import NavBar from "../../components/UI/Navbar";
import Footer from "../../components/Layout/Footer";
import styles from "../../styles/Dashboard.module.css";
// import music from "/music.svg";
// import heart from "/heart.svg";
// import goals from "/goals.png"

export default function Dashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('/api/checkAuth', { withCredentials: true });

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

    if (!isAuthenticated) {
        return (
            <div className="loading-screen d-flex flex-column align-items-center">
                {/* <Hamster /> */}
                <h2 className="loading-text">Loading...</h2>
            </div>
        );
    }

    return (
        <>
            <NavBar />
            <div className={`container mt-4 ${styles.containerHeight}`}>
                <Row className="d-flex justify-content-center align-items-center h-100">
                    <Col md={3} className="mb-5 d-flex justify-content-center">
                        <Card className={styles.card} onClick={() => router.push("/topTracks")}>
                            <div className={styles.iconContainer}>
                                <img src={'/images/heart.svg'} className={styles.icon} />
                            </div>
                            <Card.Body>
                                <Card.Title>Top Tracks</Card.Title>
                                <Card.Text>Display your favorite tracks recently</Card.Text>
                                <Card.Text>All the songs you loved</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={3} className="mb-5 d-flex justify-content-center">
                        <Card className={styles.card} onClick={() => router.push("/daily")}>
                            <div className={styles.iconContainer}>
                                <img src={'/images/heart.svg'} className={styles.icon} />
                            </div>
                            <Card.Body>
                                <Card.Title>Recommend Tracks</Card.Title>
                                <Card.Text>Display recommend tracks for you</Card.Text>
                                <Card.Text>Base on your favorite</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={3} className="mb-5 d-flex justify-content-center">
                        <Card className={styles.card} onClick={() => router.push("/challenge")}>
                            <div className={styles.iconContainer}>
                                <img src={'/images/heart.svg'} className={styles.icon} />
                            </div>
                            <Card.Body>
                                <Card.Title>Challenge</Card.Title>
                                <Card.Text>Guess the song name and singer</Card.Text>
                                <Card.Text>Explore more songs</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
            <Footer />
        </>
    );
}