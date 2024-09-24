import 'bootstrap/dist/css/bootstrap.css';
import './globals.css';
// import { Inter } from 'next/font/google'

// const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Daily Song',
  description: 'Display top tracks, recommend tracks, and daily challenge',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />

        {/* Open Graph meta tags */}
        <meta property="og:title" content="Daily Song" />
        <meta
          property="og:description"
          content="Display top tracks, recommend tracks, and daily challenge"
        />
        <meta property="og:image" content="/large_icon.png" />
        <meta property="og:url" content="https://dailysong.vercel.app" />
        <meta property="og:type" content="website" />
      </head>
      <body>{children}</body>
    </html>
  );
}
