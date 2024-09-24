import SpotifyWebAPI from 'spotify-web-api-node';

const spotifyAPI = new SpotifyWebAPI({
  redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URL,
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  clientSecret: process.env.SECRET_CLIENT_SECRET,
});

export default spotifyAPI;
