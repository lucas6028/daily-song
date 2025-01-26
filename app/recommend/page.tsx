/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { Container } from 'react-bootstrap';
import NavBar from 'components/Layout/Navbar';
import Footer from 'components/Layout/Footer';
import FixingPage from 'components/Layout/FixingPage';

function Recommend() {
  const errorMessages = [
    'Service is temporarily unavailable.',
    'The API endpoint is deprecated by Spotify.',
    'Please try again in a few minutes.',
  ];
  return (
    <>
      <Container className="my-1">
        <NavBar />
        <FixingPage messages={errorMessages} />
      </Container>
      <Footer />
    </>
  );
}

export default Recommend;
