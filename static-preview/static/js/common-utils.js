// Fonctions utilitaires communes
function formatMoney(amount) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

function getQuarter(dateStr) {
  const date = new Date(dateStr);
  const quarter = Math.floor((date.getMonth() + 3) / 3);
  return `Q${quarter} ${date.getFullYear()}`;
}

function parseAmount(value) {
  if (!value) return 0;
  
  // Convertir en chaîne si ce n'est pas déjà le cas
  let strValue = String(value);
  
  // Nettoyer la chaîne
  strValue = strValue.trim()
    .replace(/[^0-9,.-]/g, '') // Enlever tout sauf les chiffres, virgules, points et signes moins
    .replace(/,(?=[0-9]{3})/g, ''); // Enlever les virgules de milliers si suivies de 3 chiffres
  
  // Si le dernier séparateur est une virgule, la remplacer par un point
  if (strValue.lastIndexOf(',') > strValue.lastIndexOf('.')) {
    strValue = strValue.replace(/,([0-9]*)$/, '.$1');
  }
  
  // Convertir en nombre
  const number = parseFloat(strValue);
  
  // Vérifier si la conversion a réussi
  if (isNaN(number)) {
    console.warn('Impossible de parser le montant:', value);
    return 0;
  }
  
  return number;
}

// Fonction globale pour fusionner les objets de données
function mergeObjects(target, source) {
  if (!source) return target;

  // Fusionner les données par période
  if (source.byPeriod) {
    Object.entries(source.byPeriod).forEach(([period, data]) => {
      if (!target.byPeriod[period]) {
        target.byPeriod[period] = {
          total: 0,
          sources: {},
          artists: {},
          tracks: {}
        };
      }
      target.byPeriod[period].total += data.total || 0;
      
      // Fusionner les sources
      if (data.sources) {
        Object.entries(data.sources).forEach(([source, amount]) => {
          target.byPeriod[period].sources[source] = (target.byPeriod[period].sources[source] || 0) + amount;
        });
      }
      
      // Fusionner les artistes
      if (data.artists) {
        Object.entries(data.artists).forEach(([artist, amount]) => {
          target.byPeriod[period].artists[artist] = (target.byPeriod[period].artists[artist] || 0) + amount;
        });
      }
      
      // Fusionner les tracks
      if (data.tracks) {
        Object.entries(data.tracks).forEach(([track, amount]) => {
          target.byPeriod[period].tracks[track] = (target.byPeriod[period].tracks[track] || 0) + amount;
        });
      }
    });
  }

  // Fusionner les données par artiste
  if (source.byArtist) {
    Object.entries(source.byArtist).forEach(([artist, data]) => {
      if (!target.byArtist[artist]) {
        target.byArtist[artist] = {
          total: 0,
          tracks: {},
          periods: {},
          sources: {}
        };
      }
      target.byArtist[artist].total += data.total || 0;
      
      // Fusionner les tracks
      if (data.tracks) {
        Object.entries(data.tracks).forEach(([track, amount]) => {
          target.byArtist[artist].tracks[track] = (target.byArtist[artist].tracks[track] || 0) + amount;
        });
      }
      
      // Fusionner les périodes
      if (data.periods) {
        Object.entries(data.periods).forEach(([period, amount]) => {
          target.byArtist[artist].periods[period] = (target.byArtist[artist].periods[period] || 0) + amount;
        });
      }
      
      // Fusionner les sources
      if (data.sources) {
        Object.entries(data.sources).forEach(([source, amount]) => {
          target.byArtist[artist].sources[source] = (target.byArtist[artist].sources[source] || 0) + amount;
        });
      }
    });
  }

  // Fusionner les données par track
  if (source.byTrack) {
    Object.entries(source.byTrack).forEach(([track, data]) => {
      if (!target.byTrack[track]) {
        target.byTrack[track] = {
          total: 0,
          artist: data.artist,
          periods: {},
          sources: {}
        };
      }
      target.byTrack[track].total += data.total || 0;
      
      // Fusionner les périodes
      if (data.periods) {
        Object.entries(data.periods).forEach(([period, amount]) => {
          target.byTrack[track].periods[period] = (target.byTrack[track].periods[period] || 0) + amount;
        });
      }
      
      // Fusionner les sources
      if (data.sources) {
        Object.entries(data.sources).forEach(([source, amount]) => {
          target.byTrack[track].sources[source] = (target.byTrack[track].sources[source] || 0) + amount;
        });
      }
    });
  }

  // Mettre à jour le revenu total
  if (source.totalRevenue) {
    target.totalRevenue = (target.totalRevenue || 0) + source.totalRevenue;
  }

  return target;
}

// Fonction pour récupérer les données stockées
function getStoredData() {
  try {
    return JSON.parse(localStorage.getItem('csvFiles') || '[]');
  } catch (error) {
    console.error('Erreur lors de la lecture du localStorage:', error);
    return [];
  }
} 