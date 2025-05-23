class SpotifyIntegration {
  constructor() {
    // TODO: Remplacer par votre Client ID Spotify
    // 1. Créez une application sur https://developer.spotify.com/dashboard
    // 2. Copiez le Client ID de votre application
    // 3. Configurez l'URL de redirection dans les paramètres de l'application
    this.clientId = 'e7d21e22c5f24f05a446103890fb16cd';
    this.redirectUri = 'https://localhost:3000/callback';
    this.scopes = [
      'user-read-private',
      'user-read-email',
      'user-library-read',
      'user-top-read'
    ];
  }

  async getSpotifyToken() {
    try {
      console.log('Vérification du token...');
      const token = localStorage.getItem('spotify_access_token');
      console.log('Token trouvé:', token ? 'Oui' : 'Non');
      
      if (token) {
        console.log('Utilisation du token existant');
        return token;
      }

      console.log('Redirection vers la page d\'autorisation');
      // Construire l'URL d'autorisation
      const authUrl = new URL('https://accounts.spotify.com/authorize');
      authUrl.searchParams.append('client_id', this.clientId);
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('redirect_uri', this.redirectUri);
      authUrl.searchParams.append('scope', this.scopes.join(' '));
      authUrl.searchParams.append('show_dialog', 'true');

      // Rediriger vers la page d'autorisation
      window.location.href = authUrl.toString();
    } catch (error) {
      console.error('Erreur lors de l\'obtention du token:', error);
      throw error;
    }
  }

  async findSpotifyMatches(artistNames) {
    try {
      const token = await this.getSpotifyToken();
      const matches = [];

      for (const name of artistNames) {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(name)}&type=artist&limit=5`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la recherche Spotify');
        }

        const data = await response.json();
        matches.push({
          name,
          results: data.artists.items
        });
      }

      return matches;
    } catch (error) {
      console.error('Erreur lors de la recherche des correspondances:', error);
      throw error;
    }
  }

  displaySpotifyMatches(matches) {
    const container = document.getElementById('spotify-matches');
    container.innerHTML = '';

    matches.forEach(match => {
      const section = document.createElement('div');
      section.className = 'mb-4';
      section.innerHTML = `
        <h6 class="mb-3">Résultats pour "${match.name}"</h6>
        <div class="list-group">
          ${match.results.map(artist => `
            <button class="list-group-item list-group-item-action" onclick="selectSpotifyArtist('${artist.id}', '${artist.name}')">
              <div class="d-flex align-items-center">
                ${artist.images[0] ? `<img src="${artist.images[0].url}" class="rounded me-3" width="50" height="50">` : ''}
                <div>
                  <h6 class="mb-1">${artist.name}</h6>
                  <small class="text-muted">${artist.followers.total.toLocaleString()} followers</small>
                </div>
              </div>
            </button>
          `).join('')}
        </div>
      `;
      container.appendChild(section);
    });
  }

  async loadArtists() {
    try {
      const token = await this.getSpotifyToken();
      const response = await fetch('https://api.spotify.com/v1/me/following?type=artist&limit=50', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des artistes');
      }

      const data = await response.json();
      return data.artists.items;
    } catch (error) {
      console.error('Erreur lors du chargement des artistes:', error);
      throw error;
    }
  }
}

window.spotifyIntegration = new SpotifyIntegration(); 