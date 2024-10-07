'use client'

import Footer from 'components/Layout/Footer'
import NavBar from 'components/Layout/Navbar'
import React from 'react'
import { Container } from 'react-bootstrap'

function Account() {
    return (
        <Container className="mx-auto p-2">
            <NavBar />
            <h1>Account</h1>
            <Footer />
        </Container>
    )
}

export default Account