'use-client';

import 'styles/FixingPage.css'; // Import the CSS file

import Image from 'next/image';

import { FC } from 'react';

interface FixingPageProps {
  messages: string[];
}

const FixingPage: FC<FixingPageProps> = ({ messages }) => {
  return (
    <div className="fixing-page-container">
      <div className="cone-container">
        <Image
          src="/images/traffic-cone-svgrepo-com.svg"
          alt="Daily Song"
          width={237}
          height={203}
          className="traffic-cone-image"
        />
      </div>
      {messages && messages.length > 0 && (
        <div className="error-messages-container">
          <h3>We are currently fixing something. Please check back later.</h3>
          <ul className="error-message-list">
            {messages.map((message, index) => (
              <li key={index} className="error-message-item">
                {message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FixingPage;
