export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('Code manquant', { status: 400 });
  }

  try {
    // Échanger le code contre un token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(env.SPOTIFY_CLIENT_ID + ':' + env.SPOTIFY_CLIENT_SECRET)
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'https://localhost:3000/callback'
      })
    });

    if (!tokenResponse.ok) {
      throw new Error('Erreur lors de l\'échange du code');
    }

    const tokens = await tokenResponse.json();

    // Rediriger vers la page roster avec le token
    return Response.redirect('/roster?token=' + tokens.access_token);
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return new Response('Erreur d\'authentification', { status: 500 });
  }
} 