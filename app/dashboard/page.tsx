'use client';

import { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import NavBar from 'components/Layout/Navbar';
import Footer from 'components/Layout/Footer';
import styles from 'styles/Dashboard.module.css';
import Image from 'next/image';
import Loading from './loading';

export default function Dashboard() {
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

  if (!isAuthenticated) {
    return <Loading />;
  }

  return (
    <>
      <div className={`container mt-4 ${styles.containerHeight}`}>
        <NavBar />
        <Row className="d-flex justify-content-center align-items-center h-100">
          <Col md={3} className="mb-5 d-flex justify-content-center">
            <Card className={`${styles.card} shadow-lg`} onClick={() => router.push('/top-tracks')}>
              <div className={`${styles.iconContainer} text-center`}>
                <Image
                  src="/images/sleep.png"
                  alt="heart"
                  width={200}
                  height={200}
                  className={styles.icon}
                />
              </div>
              <Card.Body className="text-center">
                <Card.Title className="fw-bold">Top Tracks</Card.Title>
                <Card.Text className="text-muted">All the songs you loved</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} className="mb-5 d-flex justify-content-center">
            <Card className={styles.card} onClick={() => router.push('/recommend')}>
              <div className={styles.iconContainer}>
                <Image
                  src="/images/guitar.png"
                  alt="guitar"
                  width={200}
                  height={200}
                  className={styles.icon}
                />
              </div>
              <Card.Body>
                <Card.Title className="fw-bold">Recommend Tracks</Card.Title>
                <Card.Text className="text-muted">Display recommend tracks</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} className="mb-5 d-flex justify-content-center">
            <Card className={styles.card} onClick={() => router.push('/challenge')}>
              <div className={styles.iconContainer}>
                <Image
                  src="/images/stero.png"
                  alt="stero system"
                  width={200}
                  height={200}
                  className={styles.icon}
                />
              </div>
              <Card.Body>
                <Card.Title className="fw-bold">Challenge Tracks</Card.Title>
                <Card.Text className="text-muted">Guess song and singer</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      <Footer />
    </>
  );
}
