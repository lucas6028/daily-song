import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DailySong PWA',
    short_name: 'DailySongPWA',
    description: 'Display top tracks, recommend tracks, and daily challenge',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/images/small_icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/favicon.ico',
        sizes: '192x192',
        type: 'image/svg',
      },
    ],
  };
}
