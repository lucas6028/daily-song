'use client'

import React, { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import redirectURL from '../lib/redirectURL';
import requestAccess from '../lib/requestAccess';
import spotifyLogo from '../../assets/Spotify_logo_with_text.svg';

const Login: React.FC = () => {
    const [urlCode, setUrlCode] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const existingCode = new URLSearchParams(window.location.search).get("code");
        if (existingCode) {
            setUrlCode(existingCode);
        }
    }, [])

    useEffect(() => {
        if (urlCode) {
            requestAccess(urlCode)
                .then(() => {
                    console.log("Login successfully! Redirect to dashboard");
                    router.push("/dashboard");
                })
                .catch((err) => console.error(err));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [urlCode]);

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
            <Card style={{ width: '22rem', textAlign: 'center' }} className="p-4 bg-dark text-white shadow-lg rounded">
                <Card.Body>
                    <Card.Title className="mb-4">
                        <img
                            src={spotifyLogo}
                            alt="Spotify Logo"
                            style={{ width: '150px' }}
                        />
                    </Card.Title>
                    <Button
                        variant="outline-light"
                        className="btn-block mb-3 w-100"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '10px',
                            fontSize: '16px',
                            borderRadius: '25px',
                        }}
                        onClick={() => redirectURL()}
                    >
                        <i className="bi bi-spotify" style={{ marginRight: '8px', fontSize: '24px' }}></i>
                        Sign in with Spotify
                    </Button>
                    <Card.Text className="mt-3">
                        Don't have an account? <a href="/signup" className="text-white">Create one</a>
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Login;