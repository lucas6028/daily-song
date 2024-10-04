'use client';

import { Image as BootstrapImage, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useLogout } from 'hooks/useLogout';
import NextImage from 'next/image';
import axios from 'axios';

function NavBar() {
  const [profileImg, setProfileImg] = useState<string>('https://placehold.jp/150x150.png');
  const { logout, isLoggingOut } = useLogout();
  const githubUrl = 'https://github.com/lucas6028/daily-song';

  useEffect(() => {
    const fetchProfile = async () => {
      const imgUrl = window.localStorage.getItem('profileImgUrl');

      if (imgUrl) {
        setProfileImg(imgUrl);
        return;
      }

      try {
        const res = await axios.get('/api/profile', { withCredentials: true });

        window.localStorage.setItem('profileImgUrl', res.data.body.images[0].url);
        window.localStorage.setItem('country', res.data.country);
        window.localStorage.setItem('email', res.data.email);
        window.localStorage.setItem('followers', res.data.followers.total);
        window.localStorage.setItem('href', res.data.href);
        window.localStorage.setItem('userId', res.data.id);
        window.localStorage.setItem('product', res.data.product);

        setProfileImg(res.data.body.images[0].url);
      } catch (err) {
        console.error('Error while get user profile' + err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      className="bg-body-tertiary"
      bg="dark"
      data-bs-theme="dark"
    >
      <Container>
        <Navbar.Brand href="/">
          <NextImage
            src="/images/small_icon.png"
            width="40"
            height="40"
            className="d-inline-block align-top"
            alt="Daily Song Logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/dashboard">Dashboard</Nav.Link>
            <Nav.Link href="/top-tracks">Top Tracks</Nav.Link>
            <Nav.Link href="/recommend">Recommend</Nav.Link>
            <Nav.Link href="/challenge">Challenge</Nav.Link>
          </Nav>
          <Nav>
            <NavDropdown title="Reference" id="collapsible-nav-dropdown">
              <NavDropdown.Item href={githubUrl}>Github</NavDropdown.Item>
              <NavDropdown.Item href="https://spotify.com">Spotify</NavDropdown.Item>
              <NavDropdown.Item href="https://developer.spotify.com/">
                Spotify for Developer
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link eventKey={2} href="#memes">
              About
            </Nav.Link>
            <NavDropdown
              title={
                <BootstrapImage
                  src={profileImg}
                  roundedCircle
                  width="30"
                  height="30"
                  className="d-inline-block align-top"
                />
              }
              id="profile-nav-dropdown"
            >
              <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
              <NavDropdown.Item href="#account">Account</NavDropdown.Item>
              <NavDropdown.Item href="#settings">Settings</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={logout}>
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
