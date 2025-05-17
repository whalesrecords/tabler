// Options communes pour les graphiques
const commonOptions = {
  chart: {
    fontFamily: 'inherit',
    height: 240,
    type: 'bar',
    toolbar: {
      show: false,
    },
    animations: {
      enabled: false
    },
  },
  plotOptions: {
    bar: {
      columnWidth: '50%',
    }
  },
  dataLabels: {
    enabled: false,
  },
  fill: {
    opacity: 1,
  },
  grid: {
    padding: {
      top: -20,
      right: 0,
      left: -4,
      bottom: -4
    },
    strokeDashArray: 4,
  },
  legend: {
    show: true,
    position: 'bottom',
    offsetY: 12,
    markers: {
      width: 10,
      height: 10,
      radius: 100,
    },
    itemMargin: {
      horizontal: 8,
      vertical: 8
    },
  },
};

// Variables globales pour les graphiques
let charts = {
  revenueByPeriod: null,
  topArtists: null,
  topTracks: null,
  revenueBySource: null,
  artistEvolution: null,
  sourceEvolution: null,
  artistQuarterlyEvolution: null
};

// Variables globales
let originalData = null;
let currentFilters = {
  artist: '',
  periodStart: '',
  periodEnd: '',
  track: ''
};

// Fonction pour détruire les graphiques existants
function destroyCharts() {
  Object.values(charts).forEach(chart => {
    if (chart) {
      chart.destroy();
    }
  });
  charts = {
    revenueByPeriod: null,
    topArtists: null,
    topTracks: null,
    revenueBySource: null,
    artistEvolution: null,
    sourceEvolution: null,
    artistQuarterlyEvolution: null
  };
}

// Fonction pour trier les périodes correctement (Q1-Q4 par année)
function sortPeriods(periods) {
  return periods.sort((a, b) => {
    // Extraire l'année et le trimestre
    const [, quarterA, yearA] = a.match(/Q(\d+)\s*(\d{4})/);
    const [, quarterB, yearB] = b.match(/Q(\d+)\s*(\d{4})/);
    
    // Comparer d'abord par année
    if (yearA !== yearB) {
      return parseInt(yearA) - parseInt(yearB);
    }
    
    // Si même année, comparer par trimestre
    return parseInt(quarterA) - parseInt(quarterB);
  });
}

// Fonction pour mettre à jour les graphiques
function updateCharts(data) {
  try {
    if (!data) {
      console.warn('No data provided to updateCharts');
      return;
    }

    // Détruire les graphiques existants
    destroyCharts();

    // Vérifier que tous les éléments DOM nécessaires existent
    const elements = [
      "#chart-revenue-by-period",
      "#chart-top-artists",
      "#chart-top-tracks",
      "#chart-revenue-by-source",
      "#chart-artist-evolution",
      "#chart-artist-quarterly-evolution",
      "#chart-source-evolution"
    ];

    const missingElements = elements.filter(id => !document.querySelector(id));
    if (missingElements.length > 0) {
      console.warn('Missing DOM elements:', missingElements);
      return;
    }

    const charts = {};
    
    // Options communes pour tous les graphiques
    const commonOptions = {
      chart: {
        fontFamily: 'inherit',
        parentHeightOffset: 0,
        toolbar: {
          show: false,
        },
        animations: {
          enabled: false
        },
        stacked: false,
      },
      plotOptions: {
        bar: {
          columnWidth: '50%',
        }
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        opacity: 1,
      },
      grid: {
        padding: {
          top: -20,
          right: 0,
          left: -4,
          bottom: -4
        },
        strokeDashArray: 4,
      },
      legend: {
        show: true,
        position: 'bottom',
        offsetY: 12,
        markers: {
          width: 10,
          height: 10,
          radius: 100,
        },
        itemMargin: {
          horizontal: 8,
          vertical: 8
        },
      },
      tooltip: {
        shared: true
      }
    };

    // Graphique des revenus par période
    if (document.querySelector("#chart-revenue-by-period") && data.byPeriod) {
      const periods = sortPeriods(Object.keys(data.byPeriod));
      const revenueData = periods.map(period => ({
        x: period,
        y: data.byPeriod[period].total || 0
      }));

      charts.revenueByPeriod = new ApexCharts(document.querySelector("#chart-revenue-by-period"), {
        ...commonOptions,
        chart: {
          ...commonOptions.chart,
          type: 'line',
          height: 300
        },
        series: [{
          name: 'Revenus',
          data: revenueData
        }],
        xaxis: {
          type: 'category',
          labels: {
            style: {
              colors: '#9aa0ac',
              fontSize: '12px',
            },
            rotate: -45,
            maxHeight: 60
          }
        },
        yaxis: {
          labels: {
            formatter: formatMoney,
            style: {
              colors: '#9aa0ac',
              fontSize: '12px',
            }
          }
        },
        tooltip: {
          y: {
            formatter: formatMoney
          }
        }
      });
      charts.revenueByPeriod.render();
    }

    // Graphique des top artistes
    if (document.querySelector("#chart-top-artists") && data.byArtist) {
      const artistData = Object.entries(data.byArtist)
        .filter(([, artistData]) => artistData && typeof artistData.total === 'number')
        .sort(([, a], [, b]) => b.total - a.total)
        .slice(0, 5);

      charts.topArtists = new ApexCharts(document.querySelector("#chart-top-artists"), {
        ...commonOptions,
        chart: {
          ...commonOptions.chart,
          type: 'pie',
          height: 300
        },
        series: artistData.map(([, artist]) => artist.total),
        labels: artistData.map(([artist]) => artist),
        tooltip: {
          y: {
            formatter: formatMoney
          }
        }
      });
      charts.topArtists.render();
    }

    // Graphique des top tracks
    if (document.querySelector("#chart-top-tracks") && data.byTrack) {
      const trackData = Object.entries(data.byTrack)
        .filter(([, trackData]) => trackData && typeof trackData.total === 'number')
        .sort(([, a], [, b]) => b.total - a.total)
        .slice(0, 5);

      charts.topTracks = new ApexCharts(document.querySelector("#chart-top-tracks"), {
        ...commonOptions,
        chart: {
          ...commonOptions.chart,
          type: 'pie',
          height: 300
        },
        series: trackData.map(([, track]) => track.total),
        labels: trackData.map(([track]) => track),
        tooltip: {
          y: {
            formatter: formatMoney
          }
        }
      });
      charts.topTracks.render();
    }

    // Graphique de répartition par source
    if (document.querySelector("#chart-revenue-by-source") && data.bySource) {
      const sourceData = Object.entries(data.bySource)
        .filter(([, sourceData]) => sourceData && typeof sourceData.total === 'number');

      charts.revenueBySource = new ApexCharts(document.querySelector("#chart-revenue-by-source"), {
        ...commonOptions,
        chart: {
          ...commonOptions.chart,
          type: 'donut',
          height: 300
        },
        series: sourceData.map(([, source]) => source.total),
        labels: sourceData.map(([source]) => source),
        tooltip: {
          y: {
            formatter: formatMoney
          }
        }
      });
      charts.revenueBySource.render();
    }

    // Graphique d'évolution par artiste (mensuel)
    if (document.querySelector("#chart-artist-evolution") && data.byArtist && data.byPeriod) {
      const artistData = Object.entries(data.byArtist)
        .filter(([, artistData]) => artistData && artistData.periods)
        .sort(([, a], [, b]) => b.total - a.total)
        .slice(0, 5);

      const periods = sortPeriods(Object.keys(data.byPeriod));

      charts.artistEvolution = new ApexCharts(document.querySelector("#chart-artist-evolution"), {
        ...commonOptions,
        chart: {
          ...commonOptions.chart,
          type: 'line',
          height: 300
        },
        series: artistData.map(([artist, data]) => ({
          name: artist,
          data: periods.map(period => data.periods[period] || 0)
        })),
        xaxis: {
          categories: periods,
          labels: {
            style: {
              colors: '#9aa0ac',
              fontSize: '12px',
            },
            rotate: -45,
            maxHeight: 60
          }
        },
        yaxis: {
          labels: {
            formatter: formatMoney,
            style: {
              colors: '#9aa0ac',
              fontSize: '12px',
            }
          }
        },
        tooltip: {
          y: {
            formatter: formatMoney
          }
        }
      });
      charts.artistEvolution.render();
    }

    // Graphique d'évolution trimestrielle par artiste
    if (document.querySelector("#chart-artist-quarterly-evolution") && data.byArtist && data.byPeriod) {
      const artistData = Object.entries(data.byArtist)
        .filter(([, artistData]) => artistData && artistData.periods)
        .sort(([, a], [, b]) => b.total - a.total)
        .slice(0, 5);

      const periods = sortPeriods(Object.keys(data.byPeriod));

      charts.artistQuarterlyEvolution = new ApexCharts(document.querySelector("#chart-artist-quarterly-evolution"), {
        ...commonOptions,
        chart: {
          ...commonOptions.chart,
          type: 'line',
          height: 300
        },
        series: artistData.map(([artist, data]) => ({
          name: artist,
          data: periods.map(period => data.periods[period] || 0)
        })),
        xaxis: {
          categories: periods,
          labels: {
            style: {
              colors: '#9aa0ac',
              fontSize: '12px',
            },
            rotate: -45,
            maxHeight: 60
          }
        },
        yaxis: {
          labels: {
            formatter: formatMoney,
            style: {
              colors: '#9aa0ac',
              fontSize: '12px',
            }
          }
        },
        tooltip: {
          y: {
            formatter: formatMoney
          }
        }
      });
      charts.artistQuarterlyEvolution.render();
    }

    // Graphique d'évolution par source
    if (document.querySelector("#chart-source-evolution") && data.bySource && data.byPeriod) {
      const periods = sortPeriods(Object.keys(data.byPeriod));

      const sourceSeries = Object.entries(data.bySource)
        .filter(([, sourceData]) => sourceData)
        .map(([source]) => ({
          name: source,
          data: periods.map(period => 
            (data.byPeriod[period] && data.byPeriod[period].sources && data.byPeriod[period].sources[source]) || 0
          )
        }));

      charts.sourceEvolution = new ApexCharts(document.querySelector("#chart-source-evolution"), {
        ...commonOptions,
        chart: {
          ...commonOptions.chart,
          type: 'line',
          height: 300
        },
        series: sourceSeries,
        xaxis: {
          categories: periods,
          labels: {
            style: {
              colors: '#9aa0ac',
              fontSize: '12px',
            },
            rotate: -45,
            maxHeight: 60
          }
        },
        yaxis: {
          labels: {
            formatter: formatMoney,
            style: {
              colors: '#9aa0ac',
              fontSize: '12px',
            }
          }
        },
        tooltip: {
          y: {
            formatter: formatMoney
          }
        }
      });
      charts.sourceEvolution.render();
    }
  } catch (error) {
    console.error('Error updating charts:', error);
  }
}

// Fonction pour initialiser les filtres
function initializeFilters(data) {
  if (!data) return;

  // Remplir le filtre des artistes
  const artistSelect = document.querySelector('#artist-filter');
  if (artistSelect) {
    const artists = Object.keys(data.byArtist || {}).sort();
    artistSelect.innerHTML = '<option value="">Tous les artistes</option>' +
      artists.map(artist => `<option value="${artist}">${artist}</option>`).join('');
  }

  // Remplir les filtres de période
  const periodStart = document.querySelector('#period-start');
  const periodEnd = document.querySelector('#period-end');
  if (periodStart && periodEnd) {
    const periods = sortPeriods(Object.keys(data.byPeriod || {}));
    const periodOptions = periods.map(period => `<option value="${period}">${period}</option>`).join('');
    periodStart.innerHTML = '<option value="">Début</option>' + periodOptions;
    periodEnd.innerHTML = '<option value="">Fin</option>' + periodOptions;
  }

  // Remplir le filtre des tracks
  const trackSelect = document.querySelector('#track-filter');
  if (trackSelect) {
    const tracks = Object.keys(data.byTrack || {}).sort();
    trackSelect.innerHTML = '<option value="">Tous les albums/tracks</option>' +
      tracks.map(track => `<option value="${track}">${track}</option>`).join('');
  }
}

// Fonction pour appliquer les filtres
function applyFilters(data) {
  if (!data) return data;

  let filteredData = {
    byPeriod: {},
    byArtist: {},
    byTrack: {},
    bySource: {},
    totalRevenue: 0
  };

  // Filtrer les périodes
  const periods = Object.keys(data.byPeriod || {});
  const filteredPeriods = periods.filter(period => {
    if (currentFilters.periodStart && period < currentFilters.periodStart) return false;
    if (currentFilters.periodEnd && period > currentFilters.periodEnd) return false;
    return true;
  });

  // Appliquer les filtres
  filteredPeriods.forEach(period => {
    const periodData = data.byPeriod[period];
    
    // Filtrer par artiste si nécessaire
    if (currentFilters.artist && !periodData.artists?.[currentFilters.artist]) {
      return;
    }
    
    // Filtrer par track si nécessaire
    if (currentFilters.track && !periodData.tracks?.[currentFilters.track]) {
      return;
    }

    filteredData.byPeriod[period] = periodData;
  });

  // Mettre à jour les totaux
  Object.values(filteredData.byPeriod).forEach(periodData => {
    // Agréger les artistes
    Object.entries(periodData.artists || {}).forEach(([artist, amount]) => {
      if (!currentFilters.artist || currentFilters.artist === artist) {
        filteredData.byArtist[artist] = (filteredData.byArtist[artist] || 0) + amount;
      }
    });

    // Agréger les tracks
    Object.entries(periodData.tracks || {}).forEach(([track, amount]) => {
      if (!currentFilters.track || currentFilters.track === track) {
        filteredData.byTrack[track] = (filteredData.byTrack[track] || 0) + amount;
      }
    });

    // Agréger les sources
    Object.entries(periodData.sources || {}).forEach(([source, amount]) => {
      filteredData.bySource[source] = (filteredData.bySource[source] || 0) + amount;
    });

    filteredData.totalRevenue += periodData.total || 0;
  });

  return filteredData;
}

// Event listeners pour les filtres
document.addEventListener('DOMContentLoaded', function() {
  const applyFiltersBtn = document.querySelector('#apply-filters');
  const resetFiltersBtn = document.querySelector('#reset-filters');

  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', function() {
      currentFilters = {
        artist: document.querySelector('#artist-filter').value,
        periodStart: document.querySelector('#period-start').value,
        periodEnd: document.querySelector('#period-end').value,
        track: document.querySelector('#track-filter').value
      };
      
      const filteredData = applyFilters(originalData);
      updateCharts(filteredData);
    });
  }

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', function() {
      // Réinitialiser les sélections
      document.querySelector('#artist-filter').value = '';
      document.querySelector('#period-start').value = '';
      document.querySelector('#period-end').value = '';
      document.querySelector('#track-filter').value = '';

      // Réinitialiser les filtres et mettre à jour les graphiques
      currentFilters = {
        artist: '',
        periodStart: '',
        periodEnd: '',
        track: ''
      };
      
      updateCharts(originalData);
    });
  }
});

// Modifier la fonction d'initialisation existante
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    try {
      if (!document.querySelector("#chart-revenue-by-period")) {
        console.log('Not on charts page, skipping initialization');
        return;
      }

      const storedFiles = getStoredData();
      
      const aggregatedData = {
        byPeriod: {},
        byArtist: {},
        byTrack: {},
        bySource: {},
        totalRevenue: 0
      };

      if (Array.isArray(storedFiles)) {
        storedFiles.forEach(fileData => {
          if (fileData && fileData.data && fileData.template && fileData.template.source) {
            console.log('Processing file:', fileData.fileName, 'with template:', fileData.template.source);
            mergeObjects(aggregatedData, fileData.data);
          } else {
            console.warn('Skipping invalid file data:', fileData);
          }
        });
      } else {
        console.warn('No valid stored files found');
      }

      console.log('Aggregated data for charts:', aggregatedData);
      
      // Stocker les données originales
      originalData = aggregatedData;
      
      // Initialiser les filtres
      initializeFilters(aggregatedData);
      
      // Mettre à jour les graphiques
      updateCharts(aggregatedData);
    } catch (error) {
      console.error('Error during initialization:', error);
    }
  }, 500);
}); 