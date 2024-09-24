'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Helloworld() {
  const [message, setMessage] = useState('Hello World');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/data');
        setMessage(response.data.message);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);
  return <p>{message}</p>;
}

export default Helloworld;
