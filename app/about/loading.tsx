import React from 'react';
import Hamster from 'components/Layout/Hamster';

export default function loading() {
  return (
    <div className="container d-flex flex-column align-items-center">
      <Hamster />
      <h2>Loading...</h2>
    </div>
  );
}
