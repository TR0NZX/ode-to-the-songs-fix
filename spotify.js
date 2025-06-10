
async function getSpotifyToken() {
  const clientId = 'fc3e6a83f2cb4c39bf0cbd80088df7f2';
  const clientSecret = '4b1080daca924ea1beaa0740133cef3e';
  const auth = btoa(`${clientId}:${clientSecret}`);

    getSpotifyToken().then(token => console.log('Access Token:', token));

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${auth}`,
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token; // Inilah token yang kamu pakai di API Spotify

  
}
