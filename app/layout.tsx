import 'bootstrap/dist/css/bootstrap.css';
import './globals.css';
// import { Inter } from 'next/font/google'
// import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';
import { Suspense } from 'react';
import Loading from 'components/Layout/Loading';

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
      <body>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </body>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-0RRDH6KHKD"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0RRDH6KHKD');
          `}
      </Script>
      {/*<GoogleAnalytics gaId="G-0RRDH6KHKD" />*/}
    </html>
  );
}
