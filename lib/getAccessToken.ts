async function getAccessToken() {
  const clientID = process.env.NEXT_PUBLIC_KKBOX_CLIENT_ID;
  const clientSecret = process.env.SECRET_KKBOX_CLIENT_SECRET;

  // Token should be stored securely (e.g., in a database) and refreshed periodically
  // This example shows a basic fetch - you'll likely need to implement proper token management

  try {
    const response = await fetch('https://account.kkbox.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientID || '',
        client_secret: clientSecret || '',
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error);
    return null;
  }
}

export default getAccessToken;
