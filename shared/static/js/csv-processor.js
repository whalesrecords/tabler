// Template definitions
const templates = {
  tunecore: {
    track_column: "Song Title",
    artist_column: "Artist",
    upc_column: "UPC",
    revenue_column: "Total Earned",
    date_column: "Sales Period",
    source: "Tunecore",
    currency: "EUR",
    mapping: {
      "Sales Period": 0,
      "Artist": 1,
      "Song Title": 2,
      "UPC": 3,
      "Total Earned": 4
    }
  },
  believe_uk: {
    track_column: "Track title",
    upc_column: "UPC",
    revenue_column: "Net Income",
    date_column: "Reporting Date",
    source: "BELIEVE UK",
    mapping: {
      "Reporting Date": 0,
      "Track title": 1,
      "UPC": 2,
      "Net Income": 3
    }
  },
  believe: {
    track_column: "Track title",
    upc_column: "UPC",
    revenue_column: "Net Income",
    date_column: "Operation Date",
    source: "BELIEVE",
    mapping: {
      "Operation Date": 0,
      "Track title": 1,
      "UPC": 2,
      "Net Income": 3
    }
  },
  tunecore_plus: {
    track_column: "Song Title",
    artist_column: "Artist",
    upc_column: "UPC",
    revenue_column: "Total Earned",
    date_column: "Posted Date",
    source: "Tunecore",
    currency: "EUR",
    mapping: {
      "Posted Date": 0,
      "Artist": 1,
      "Song Title": 2,
      "UPC": 3,
      "Total Earned": 4
    }
  },
  tunecore_real: {
    track_column: "Song Title",
    artist_column: "Artist",
    upc_column: "UPC",
    revenue_column: "Total Earned",
    date_column: "Sales Period",
    source: "Tunecore",
    currency: "EUR",
    mapping: {
      "Sales Period": 0,
      "Artist": 1,
      "Song Title": 2,
      "UPC": 3,
      "Total Earned": 4
    }
  },
  dashgo: {
    track_column: "Track Title",
    artist_column: "Artist Name",
    upc_column: "UPC",
    revenue_column: "Payable",
    date_column: "Transaction Date",
    currency: "USD",
    source: "DashGo",
    mapping: {
      "Transaction Date": 0,
      "Artist Name": 1,
      "Track Title": 2,
      "UPC": 3,
      "Payable": 4
    }
  },
  spotify: {
    date_column: "Period",
    track_column: "Track Name",
    artist_column: "Artist Name",
    upc_column: "UPC",
    revenue_column: "EUR",
    source_column: "Service",
    currency: "EUR",
    source: "Spotify",
    mapping: {
      "Period": 0,
      "Service": 1,
      "Territory": 2,
      "Artist Name": 3,
      "Track Name": 4,
      "ISRC": 5,
      "UPC": 6,
      "Quantity": 7,
      "USD": 8,
      "Exchange Rate": 9,
      "EUR": 10
    }
  },
  apple: {
    date_column: "Begin Date",
    track_column: "Title",
    artist_column: "Artist",
    upc_column: "UPC",
    revenue_column: "Extended Price (EUR)",
    source_column: "Store",
    currency: "EUR",
    source: "Apple Music",
    mapping: {
      "Begin Date": 0,
      "End Date": 1,
      "UPC": 2,
      "ISRC": 3,
      "Artist": 4,
      "Title": 5,
      "Label": 6,
      "Store": 7,
      "Territory": 8,
      "Product Type": 9,
      "Units": 10,
      "Unit Price (USD)": 11,
      "Extended Price (USD)": 12,
      "Exchange Rate": 13,
      "Extended Price (EUR)": 14
    }
  },
  bandcamp: {
    date_column: "Date",
    track_column: "Item",
    artist_column: "Artist",
    upc_column: "SKU",
    revenue_column: "Net Amount (EUR)",
    source_column: "Type",
    currency: "EUR",
    source: "Bandcamp",
    mapping: {
      "Date": 0,
      "Type": 1,
      "Item": 2,
      "Artist": 3,
      "SKU": 4,
      "Net Amount (USD)": 5,
      "Exchange Rate": 6,
      "Net Amount (EUR)": 7
    }
  }
};

let currentData = null;
let currentTemplate = null;

function detectDelimiter(text) {
  const delimiters = [',', ';', '\t', '|'];
  const firstLines = text.split('\n').slice(0, 5);
  const scores = {};
  
  delimiters.forEach(delimiter => {
    scores[delimiter] = 0;
    firstLines.forEach(line => {
      let count = 0;
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        if (line[i] === '"') {
          inQuotes = !inQuotes;
        } else if (!inQuotes && line[i] === delimiter) {
          count++;
        }
      }
      scores[delimiter] += count;
    });
  });
  
  return Object.entries(scores).reduce((a, b) => b[1] > a[1] ? b : a)[0];
}

function getQuarter(dateStr) {
  const date = new Date(dateStr);
  const quarter = Math.floor((date.getMonth() + 3) / 3);
  return `Q${quarter} ${date.getFullYear()}`;
}

function formatMoney(amount) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
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

function parseCSV(text) {
  const delimiter = detectDelimiter(text);
  console.log('Detected delimiter:', delimiter);
  const lines = text.split('\n').filter(line => line.trim());
  
  // Get headers from first line
  const headers = lines[0].split(delimiter).map(header => header.trim().replace(/^"(.*)"$/, '$1'));
  console.log('Headers:', headers);
  
  // Process data lines (skip header)
  return lines.slice(1).map(line => {
    const values = [];
    let value = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          value += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        values.push(value.trim());
        value = '';
      } else {
        value += char;
      }
    }
    
    values.push(value.trim());
    
    const templateType = document.getElementById('templateSelect').value;
    const template = templates[templateType];
    
    if (!template) {
      console.error('Template or mapping not found');
      return {};
    }

    // Map values to their corresponding headers
    const result = {};
    headers.forEach((header, index) => {
      result[header] = values[index] || '';
    });
    
    return result;
  });
}

function aggregateData(data, template) {
  const byArtist = {};
  const byPeriod = {};
  const byTrack = {};

  data.forEach(row => {
    const artist = row[template.artist_column] || 'Unknown Artist';
    const track = row[template.track_column] || 'Unknown Track';
    const period = getQuarter(row[template.date_column]);
    const revenue = parseFloat(row[template.revenue_column] || '0');

    // Par artiste
    if (!byArtist[artist]) {
      byArtist[artist] = { total: 0, tracks: {}, periods: {} };
    }
    byArtist[artist].total += revenue;
    if (!byArtist[artist].tracks[track]) {
      byArtist[artist].tracks[track] = 0;
    }
    byArtist[artist].tracks[track] += revenue;
    if (!byArtist[artist].periods[period]) {
      byArtist[artist].periods[period] = 0;
    }
    byArtist[artist].periods[period] += revenue;

    // Par période
    if (!byPeriod[period]) {
      byPeriod[period] = { total: 0, artists: {}, tracks: {} };
    }
    byPeriod[period].total += revenue;
    if (!byPeriod[period].artists[artist]) {
      byPeriod[period].artists[artist] = 0;
    }
    byPeriod[period].artists[artist] += revenue;
    if (!byPeriod[period].tracks[track]) {
      byPeriod[period].tracks[track] = 0;
    }
    byPeriod[period].tracks[track] += revenue;

    // Par track
    if (!byTrack[track]) {
      byTrack[track] = { total: 0, artists: {}, periods: {} };
    }
    byTrack[track].total += revenue;
    if (!byTrack[track].artists[artist]) {
      byTrack[track].artists[artist] = 0;
    }
    byTrack[track].artists[artist] += revenue;
    if (!byTrack[track].periods[period]) {
      byTrack[track].periods[period] = 0;
    }
    byTrack[track].periods[period] += revenue;
  });

  return { byArtist, byPeriod, byTrack };
}

function createArtistCard(artist, data) {
  const card = document.createElement('div');
  card.className = 'col-md-6 col-lg-4';
  card.innerHTML = `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">${artist}</h3>
      </div>
      <div class="card-body">
        <div class="h1 mb-3">${formatMoney(data.total)}</div>
        <div class="mb-2">
          <h4>Top Tracks</h4>
          ${Object.entries(data.tracks)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([track, amount]) => `
              <div class="d-flex align-items-center mb-2">
                <div class="flex-grow-1">
                  <div class="font-weight-bold">${track}</div>
                </div>
                <div class="ms-2">${formatMoney(amount)}</div>
              </div>
            `).join('')}
        </div>
        <div>
          <h4>Par Période</h4>
          ${Object.entries(data.periods)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([period, amount]) => `
              <div class="d-flex align-items-center mb-2">
                <div class="flex-grow-1">${period}</div>
                <div class="ms-2">${formatMoney(amount)}</div>
              </div>
            `).join('')}
        </div>
      </div>
    </div>
  `;
  return card;
}

function createPeriodCard(period, data) {
  const card = document.createElement('div');
  card.className = 'col-md-6 col-lg-4';
  card.innerHTML = `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">${period}</h3>
      </div>
      <div class="card-body">
        <div class="h1 mb-3">${formatMoney(data.total)}</div>
        <div class="mb-2">
          <h4>Top Artists</h4>
          ${Object.entries(data.artists)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([artist, amount]) => `
              <div class="d-flex align-items-center mb-2">
                <div class="flex-grow-1">
                  <div class="font-weight-bold">${artist}</div>
                </div>
                <div class="ms-2">${formatMoney(amount)}</div>
              </div>
            `).join('')}
        </div>
        <div>
          <h4>Top Tracks</h4>
          ${Object.entries(data.tracks)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([track, amount]) => `
              <div class="d-flex align-items-center mb-2">
                <div class="flex-grow-1">${track}</div>
                <div class="ms-2">${formatMoney(amount)}</div>
              </div>
            `).join('')}
        </div>
      </div>
    </div>
  `;
  return card;
}

function createTrackCard(track, data) {
  const card = document.createElement('div');
  card.className = 'col-md-6 col-lg-4';
  card.innerHTML = `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">${track}</h3>
      </div>
      <div class="card-body">
        <div class="h1 mb-3">${formatMoney(data.total)}</div>
        <div class="mb-2">
          <h4>Par Artiste</h4>
          ${Object.entries(data.artists)
            .sort(([,a], [,b]) => b - a)
            .map(([artist, amount]) => `
              <div class="d-flex align-items-center mb-2">
                <div class="flex-grow-1">
                  <div class="font-weight-bold">${artist}</div>
                </div>
                <div class="ms-2">${formatMoney(amount)}</div>
              </div>
            `).join('')}
        </div>
        <div>
          <h4>Par Période</h4>
          ${Object.entries(data.periods)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([period, amount]) => `
              <div class="d-flex align-items-center mb-2">
                <div class="flex-grow-1">${period}</div>
                <div class="ms-2">${formatMoney(amount)}</div>
              </div>
            `).join('')}
        </div>
      </div>
    </div>
  `;
  return card;
}

async function processFiles(files, template) {
  const allData = [];
  
  for (const file of files) {
    const text = await readFileAsync(file);
    const data = parseCSV(text);
    allData.push(...data);
  }
  
  return allData;
}

function readFileAsync(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
}

function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

function exportToCSV(data, template) {
  const aggregated = aggregateData(data, template);
  
  // Pour chaque artiste, créer un fichier CSV séparé
  Object.entries(aggregated.byArtist).forEach(([artist, artistData]) => {
    const csvRows = [];
    const currentDate = formatDate(new Date());
    
    // En-têtes
    csvRows.push(['Track', 'UPC', 'Période', 'Source', 'Revenus']);
    
    // Données par track
    let totalRevenue = 0;
    Object.entries(artistData.tracks).forEach(([track, trackTotal]) => {
      // Trouver toutes les entrées pour cette track
      data.filter(row => 
        row[template.artist_column] === artist && 
        row[template.track_column] === track
      ).forEach(row => {
        const period = getQuarter(row[template.date_column]);
        const revenue = parseFloat(row[template.revenue_column] || '0');
        totalRevenue += revenue;
        
        csvRows.push([
          track,
          row[template.upc_column] || '',
          period,
          template.source,
          revenue.toFixed(2)
        ]);
      });
    });
    
    // Ajouter des lignes vides et le total
    csvRows.push([]);
    csvRows.push(['TOTAL', '', '', '', totalRevenue.toFixed(2)]);
    
    // Convertir en CSV
    const csvContent = csvRows.map(row => row.join(';')).join('\n');
    
    // Créer le nom du fichier
    const fileName = `Whales_Records_Statement_${artist.replace(/[^a-z0-9]/gi, '_')}_${template.source}_${currentDate}.csv`;
    
    // Créer et télécharger le fichier
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

function updateView(viewType) {
  document.getElementById('artistView').style.display = viewType === 'artist' ? 'block' : 'none';
  document.getElementById('periodView').style.display = viewType === 'period' ? 'block' : 'none';
  document.getElementById('trackView').style.display = viewType === 'track' ? 'block' : 'none';
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
  const importForms = document.getElementById('importForms');
  const addImportBtn = document.getElementById('addImportBtn');
  const exportBtn = document.getElementById('exportBtn');
  
  // Store all imported data
  let globalImportedData = {
    artists: {},
    periods: {},
    tracks: {}
  };

  // Initialize the first import form
  initializeImportForm(importForms.querySelector('.import-form'));

  // Add new import form
  addImportBtn.addEventListener('click', function() {
    const newForm = importForms.querySelector('.import-form').cloneNode(true);
    newForm.querySelector('.csv-file').value = '';
    newForm.querySelector('.remove-import').style.display = 'block';
    initializeImportForm(newForm);
    importForms.appendChild(newForm);
  });

  // Handle view type changes
  document.querySelectorAll('input[name="viewType"]').forEach(radio => {
    radio.addEventListener('change', function() {
      updateView(this.value);
    });
  });

  function initializeImportForm(formElement) {
    const removeBtn = formElement.querySelector('.remove-import');
    const fileInput = formElement.querySelector('.csv-file');
    const templateSelect = formElement.querySelector('.template-select');

    if (removeBtn) {
      removeBtn.addEventListener('click', function() {
        formElement.remove();
      });
    }

    fileInput.addEventListener('change', async function() {
      const files = this.files;
      const template = templateSelect.value;
      
      for (let file of files) {
        try {
          const data = await processCSV(file, template);
          mergeData(data);
          updateAllViews();
        } catch (error) {
          console.error('Error processing file:', error);
          alert('Erreur lors du traitement du fichier: ' + error.message);
        }
      }
    });
  }

  async function processCSV(file, template) {
    const text = await file.text();
    const delimiter = detectDelimiter(text);
    console.log('Detected delimiter:', delimiter);
    
    const lines = text.split('\n').map(line => line.split(delimiter).map(cell => cell.trim().replace(/^"(.*)"$/, '$1')));
    const headers = lines[0].map(header => header.trim());
    
    console.log('CSV Headers (raw):', lines[0]);
    console.log('CSV Headers (processed):', headers);
    
    // Log des premières lignes pour debug
    console.log('First few rows:', lines.slice(1, 3));
    
    const data = {
        artists: {},
        periods: {},
        tracks: {}
    };

    // Skip header row
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].length !== headers.length || !lines[i].some(cell => cell.trim())) continue;
        
        const row = {};
        headers.forEach((header, index) => {
            row[header] = lines[i][index];
        });

        console.log(`Processing row ${i}:`, row);

        // Process based on template
        switch (template.toLowerCase()) {
            case 'tunecore':
                processTunecoreRow(row, data);
                break;
            case 'bandcamp':
                processBandcampRow(row, data);
                break;
            case 'believe':
            case 'believe_uk':
                processBelieveRow(row, data);
                break;
            case 'dashgo':
                processDashgoRow(row, data);
                break;
            default:
                // Essayer de détecter automatiquement le template basé sur les en-têtes
                if (headers.includes('Transaction Date') && headers.includes('Store')) {
                    console.log('Détection automatique: DashGo détecté');
                    processDashgoRow(row, data);
                } else if (headers.includes('Artist Name') && headers.includes('Song Title')) {
                    console.log('Détection automatique: Tunecore détecté');
                    processTunecoreRow(row, data);
                } else if (headers.some(h => ['Item type', 'Net revenue', 'Artist Name'].includes(h))) {
                    console.log('Détection automatique: Bandcamp détecté');
                    processBandcampRow(row, data);
                } else if (headers.includes('Net Amount')) {
                    console.log('Détection automatique: Believe détecté');
                    processBelieveRow(row, data);
                } else {
                    console.warn('Template non reconnu:', template, 'Headers:', headers);
                }
        }
    }

    return data;
  }

  function processTunecoreRow(row, data) {
    const artist = row['Artist Name'] || row['Artist'] || row['ARTIST'] || row['ARTIST NAME'] || 'Unknown Artist';
    const track = row['Song Title'] || row['Track'] || row['SONG TITLE'] || row['TRACK'] || 'Unknown Track';
    const period = row['Sale Month'] || row['Sales Period'] || row['Period'] || row['PERIOD'] || 'Unknown Period';
    const revenue = parseAmount(row['Net Revenue'] || row['Revenue'] || row['NET REVENUE'] || row['REVENUE'] || row['Total Earned'] || row['TOTAL EARNED'] || '0');
    
    console.log('Tunecore Processing:', { artist, track, period, revenue, originalValue: row['Net Revenue'] || row['Revenue'] || row['NET REVENUE'] || row['REVENUE'] || row['Total Earned'] || row['TOTAL EARNED'] });
    updateDataStructure(data, artist, track, period, revenue, 'Tunecore');
  }

  function processBandcampRow(row, data) {
    // Log complet des données pour debug
    console.log('Bandcamp Raw Row:', row);
    console.log('Bandcamp Available Headers:', Object.keys(row));

    // Vérification des colonnes Bandcamp avec les noms de colonnes corrects
    const possibleArtistColumns = ['Artist name', 'Artist Name', 'Item artist', 'Artist', 'artist', 'ARTIST'];
    console.log('Checking artist columns:', possibleArtistColumns.map(col => ({
        column: col,
        value: row[col]
    })));

    const artist = row['Artist name'] || row['Artist Name'] || row['Item artist'] || row['Artist'] || row['artist'] || row['ARTIST'] || 'Unknown Artist';
    const track = row['Item name'] || row['Item'] || row['Title'] || row['TITLE'] || 'Unknown Track';
    const period = row['Transaction date from'] || row['Transaction date'] || row['Date'] || row['date'] || row['DATE'] || 'Unknown Period';
    const revenue = parseAmount(row['Net revenue'] || row['Net Revenue'] || row['NET REVENUE'] || row['Payout amount (USD)'] || row['Payout amount'] || '0');
    
    // Si c'est un album, on utilise un format spécial pour le track
    const itemType = row['Item type'] || row['item_type'] || '';
    const finalTrack = itemType.toLowerCase() === 'album' ? `[Album] ${track}` : track;
    
    console.log('Bandcamp Processing:', { 
        artist, 
        track: finalTrack, 
        period, 
        revenue, 
        itemType,
        originalValue: row['Net revenue'] || row['Net Revenue'] || row['NET REVENUE'],
        availableColumns: Object.keys(row)
    });
    
    updateDataStructure(data, artist, finalTrack, period, revenue, 'Bandcamp');
  }

  function processBelieveRow(row, data) {
    const artist = row['Artist'] || row['ARTIST'] || row['artist'] || row['Artist Name'] || 'Unknown Artist';
    const track = row['Track'] || row['TRACK'] || row['track'] || row['Track Title'] || 'Unknown Track';
    const period = row['Period'] || row['PERIOD'] || row['period'] || row['Date'] || 'Unknown Period';
    const revenue = parseAmount(row['Net Amount'] || row['Amount'] || row['Revenue'] || row['NET AMOUNT'] || row['Net Income'] || '0');
    
    console.log('Believe Processing:', { artist, track, period, revenue, originalValue: row['Net Amount'] || row['Amount'] || row['Revenue'] || row['NET AMOUNT'] || row['Net Income'] });
    updateDataStructure(data, artist, track, period, revenue, 'Believe');
  }

  function processDashgoRow(row, data) {
    const artist = row['Artist Name'] || row['ARTIST NAME'] || row['artist_name'] || 'Unknown Artist';
    const track = row['Track Title'] || row['TRACK TITLE'] || row['track_title'] || 'Unknown Track';
    const period = row['Transaction Date'] || row['TRANSACTION DATE'] || row['transaction_date'] || 'Unknown Period';
    const revenue = parseAmount(row['Payable'] || row['PAYABLE'] || row['payable'] || row['Net Amount'] || '0');
    const store = row['Store'] || row['STORE'] || row['store'] || '';
    
    console.log('DashGo Processing:', { artist, track, period, revenue, store, originalValue: row['Payable'] || row['PAYABLE'] || row['payable'] || row['Net Amount'] });
    updateDataStructure(data, artist, track, period, revenue, `DashGo (${store})`);
  }

  function updateDataStructure(data, artist, track, period, revenue, source) {
    // Update artists data
    if (!data.artists[artist]) {
      data.artists[artist] = { total: 0, tracks: {}, sources: {} };
    }
    data.artists[artist].total += revenue;
    if (!data.artists[artist].sources[source]) {
      data.artists[artist].sources[source] = 0;
    }
    data.artists[artist].sources[source] += revenue;
    
    // Update tracks data
    if (!data.tracks[track]) {
      data.tracks[track] = { total: 0, artist: artist, sources: {} };
    }
    data.tracks[track].total += revenue;
    if (!data.tracks[track].sources[source]) {
      data.tracks[track].sources[source] = 0;
    }
    data.tracks[track].sources[source] += revenue;
    
    // Update periods data
    if (!data.periods[period]) {
      data.periods[period] = { total: 0, artists: {}, sources: {} };
    }
    data.periods[period].total += revenue;
    if (!data.periods[period].sources[source]) {
      data.periods[period].sources[source] = 0;
    }
    data.periods[period].sources[source] += revenue;
    if (!data.periods[period].artists[artist]) {
      data.periods[period].artists[artist] = { total: 0, sources: {} };
    }
    data.periods[period].artists[artist].total += revenue;
    if (!data.periods[period].artists[artist].sources[source]) {
      data.periods[period].artists[artist].sources[source] = 0;
    }
    data.periods[period].artists[artist].sources[source] += revenue;
  }

  function mergeData(newData) {
    // Merge artists
    for (const [artist, data] of Object.entries(newData.artists)) {
      if (!globalImportedData.artists[artist]) {
        globalImportedData.artists[artist] = { 
          total: 0, 
          tracks: {}, 
          sources: {} 
        };
      }
      globalImportedData.artists[artist].total += data.total;
      
      // Merge sources
      for (const [source, amount] of Object.entries(data.sources)) {
        if (!globalImportedData.artists[artist].sources[source]) {
          globalImportedData.artists[artist].sources[source] = 0;
        }
        globalImportedData.artists[artist].sources[source] += amount;
      }
    }

    // Merge tracks
    for (const [track, data] of Object.entries(newData.tracks)) {
      if (!globalImportedData.tracks[track]) {
        globalImportedData.tracks[track] = { 
          total: 0, 
          artist: data.artist, 
          sources: {} 
        };
      }
      globalImportedData.tracks[track].total += data.total;
      
      // Merge sources
      for (const [source, amount] of Object.entries(data.sources)) {
        if (!globalImportedData.tracks[track].sources[source]) {
          globalImportedData.tracks[track].sources[source] = 0;
        }
        globalImportedData.tracks[track].sources[source] += amount;
      }
    }

    // Merge periods
    for (const [period, data] of Object.entries(newData.periods)) {
      if (!globalImportedData.periods[period]) {
        globalImportedData.periods[period] = { 
          total: 0, 
          artists: {}, 
          sources: {} 
        };
      }
      globalImportedData.periods[period].total += data.total;
      
      // Merge sources
      for (const [source, amount] of Object.entries(data.sources)) {
        if (!globalImportedData.periods[period].sources[source]) {
          globalImportedData.periods[period].sources[source] = 0;
        }
        globalImportedData.periods[period].sources[source] += amount;
      }
      
      // Merge artists within periods
      for (const [artist, artistData] of Object.entries(data.artists)) {
        if (!globalImportedData.periods[period].artists[artist]) {
          globalImportedData.periods[period].artists[artist] = {
            total: 0,
            sources: {}
          };
        }
        globalImportedData.periods[period].artists[artist].total += artistData.total;
        
        // Merge sources for artists within periods
        for (const [source, amount] of Object.entries(artistData.sources)) {
          if (!globalImportedData.periods[period].artists[artist].sources[source]) {
            globalImportedData.periods[period].artists[artist].sources[source] = 0;
          }
          globalImportedData.periods[period].artists[artist].sources[source] += amount;
        }
      }
    }
  }

  function updateAllViews() {
    updateArtistView();
    updatePeriodView();
    updateTrackView();
  }

  function updateArtistView() {
    const container = document.getElementById('artist-cards');
    container.innerHTML = '';

    Object.entries(globalImportedData.artists)
      .sort(([, a], [, b]) => b.total - a.total)
      .forEach(([artist, data]) => {
        const card = createCard(artist, data, 'artist');
        container.appendChild(card);
      });
  }

  function updatePeriodView() {
    const container = document.getElementById('period-cards');
    container.innerHTML = '';

    Object.entries(globalImportedData.periods)
      .sort(([a], [b]) => new Date(b) - new Date(a))
      .forEach(([period, data]) => {
        const card = createCard(period, data, 'period');
        container.appendChild(card);
      });
  }

  function updateTrackView() {
    const container = document.getElementById('track-cards');
    container.innerHTML = '';

    Object.entries(globalImportedData.tracks)
      .sort(([, a], [, b]) => b.total - a.total)
      .forEach(([track, data]) => {
        const card = createCard(track, data, 'track');
        container.appendChild(card);
      });
  }

  function createCard(title, data, type) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';

    const card = document.createElement('div');
    card.className = 'card';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const titleElement = document.createElement('h3');
    titleElement.className = 'card-title';
    titleElement.textContent = title;

    const totalAmount = document.createElement('div');
    totalAmount.className = 'h1 mb-3';
    totalAmount.textContent = formatMoney(data.total);

    cardBody.appendChild(titleElement);
    cardBody.appendChild(totalAmount);

    // Ajouter la répartition par source
    if (data.sources && Object.keys(data.sources).length > 0) {
      const sourcesDiv = document.createElement('div');
      sourcesDiv.className = 'mb-3';
      sourcesDiv.innerHTML = '<h4>Par Source</h4>';

      Object.entries(data.sources)
        .sort(([, a], [, b]) => b - a)
        .forEach(([source, amount]) => {
          const sourceRow = document.createElement('div');
          sourceRow.className = 'd-flex align-items-center mb-2';
          sourceRow.innerHTML = `
            <div class="flex-grow-1">
              <div class="font-weight-bold">${source}</div>
            </div>
            <div class="ms-2">${formatMoney(amount)}</div>
          `;
          sourcesDiv.appendChild(sourceRow);
        });

      cardBody.appendChild(sourcesDiv);
    }

    // Ajouter des détails spécifiques selon le type
    if (type === 'artist' && data.tracks) {
      const tracksDiv = document.createElement('div');
      tracksDiv.innerHTML = '<h4>Top Tracks</h4>';
      Object.entries(data.tracks)
        .sort(([, a], [, b]) => b.total - a.total)
        .slice(0, 3)
        .forEach(([track, trackData]) => {
          const trackRow = document.createElement('div');
          trackRow.className = 'd-flex align-items-center mb-2';
          trackRow.innerHTML = `
            <div class="flex-grow-1">
              <div class="font-weight-bold">${track}</div>
            </div>
            <div class="ms-2">${formatMoney(trackData.total)}</div>
          `;
          tracksDiv.appendChild(trackRow);
        });
      cardBody.appendChild(tracksDiv);
    }

    if (type === 'track' && data.artist) {
      const artistDiv = document.createElement('div');
      artistDiv.className = 'text-muted mb-3';
      artistDiv.textContent = `Artist: ${data.artist}`;
      cardBody.appendChild(artistDiv);
    }

    card.appendChild(cardBody);
    col.appendChild(card);
    return col;
  }

  // Export functionality
  exportBtn.addEventListener('click', function() {
    const currentView = document.querySelector('input[name="viewType"]:checked').value;
    let csvContent = '';

    switch (currentView) {
      case 'artist':
        csvContent = 'Artist,Revenue\n';
        Object.entries(globalImportedData.artists)
          .sort(([, a], [, b]) => b.total - a.total)
          .forEach(([artist, data]) => {
            csvContent += `"${artist}",${data.total.toFixed(2)}\n`;
          });
        break;

      case 'period':
        csvContent = 'Period,Revenue\n';
        Object.entries(globalImportedData.periods)
          .sort(([a], [b]) => new Date(b) - new Date(a))
          .forEach(([period, data]) => {
            csvContent += `"${period}",${data.total.toFixed(2)}\n`;
          });
        break;

      case 'track':
        csvContent = 'Track,Artist,Revenue\n';
        Object.entries(globalImportedData.tracks)
          .sort(([, a], [, b]) => b.total - a.total)
          .forEach(([track, data]) => {
            csvContent += `"${track}","${data.artist}",${data.total.toFixed(2)}\n`;
          });
        break;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `royalties_${currentView}_export.csv`;
    link.click();
  });
}); 