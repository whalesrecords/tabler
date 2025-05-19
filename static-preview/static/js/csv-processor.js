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
    date_column: "date",
    track_column: "item name",
    artist_column: "artist",
    upc_column: "upc",
    revenue_column: "net amount",
    source_column: "Item type",
    currency: "EUR",
    source: "Bandcamp",
    mapping: {
      "date": 0,
      "artist": 1,
      "item name": 2,
      "upc": 3,
      "net amount": 4,
      "Item type": 5
    }
  }
};

let currentData = null;
let currentTemplate = null;

// Fonctions de gestion de la persistance
function saveToLocalStorage(fileData) {
  try {
    if (!fileData || !fileData.fileName || !fileData.template) {
      throw new Error('Données de fichier invalides');
    }

    // Récupérer les données existantes
    let storedFiles = JSON.parse(localStorage.getItem('csvFiles') || '[]');
    
    // Ajouter les métadonnées
    const enhancedFileData = {
      ...fileData,
      fileId: generateFileId(fileData, fileData.template),
      importDate: new Date().toISOString()
    };
    
    // Ajouter le nouveau fichier
    storedFiles.push(enhancedFileData);
    
    // Sauvegarder dans le localStorage
    localStorage.setItem('csvFiles', JSON.stringify(storedFiles));
    
    // Mettre à jour l'affichage de la liste
    displayStoredFiles();
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde dans le localStorage:', error);
    console.log('Données du fichier:', fileData);
    return false;
  }
}

function getStoredData() {
  try {
    return JSON.parse(localStorage.getItem('csvFiles') || '[]');
  } catch (error) {
    console.error('Erreur lors de la lecture du localStorage:', error);
    return [];
  }
}

function isFileAlreadyImported(newFileData) {
  const storedFiles = getStoredData();
  
  // Vérifier si un fichier avec le même contenu existe déjà
  return storedFiles.some(storedFile => {
    // Comparer les propriétés pertinentes
    return (
      storedFile.fileName === newFileData.fileName &&
      storedFile.fileSize === newFileData.fileSize &&
      storedFile.lastModified === newFileData.lastModified
    );
  });
}

function getStoredDataForCharts() {
  return getStoredData();
}

function detectDelimiter(text) {
  console.log('Detecting delimiter for text starting with:', text.substring(0, 100));
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
  
  console.log('Delimiter scores:', scores);
  const detectedDelimiter = Object.entries(scores).reduce((a, b) => b[1] > a[1] ? b : a)[0];
  console.log('Selected delimiter:', detectedDelimiter);
  return detectedDelimiter;
}

function parseBandcampDate(dateStr) {
  try {
    console.log('Parsing Bandcamp date:', dateStr);
    
    if (!dateStr || typeof dateStr !== 'string') {
      throw new Error('Invalid date string provided');
    }

    // Format attendu: MM/DD/YY HH:MMam/pm
    // Exemple: 4/12/14 5:21pm
    const [datePart, timePart] = dateStr.trim().split(' ');
    
    if (!datePart || !timePart) {
      throw new Error('Could not split date and time parts');
    }
    
    console.log('Date parts:', { datePart, timePart });
    
    // Parse date part
    const [month, day, year] = datePart.split('/').map(num => parseInt(num, 10));
    if (isNaN(month) || isNaN(day) || isNaN(year)) {
      throw new Error('Invalid date numbers');
    }
    console.log('Date components:', { month, day, year });
    
    // Parse time part
    const timeMatch = timePart.match(/^(\d{1,2}):(\d{2})(am|pm)$/i);
    if (!timeMatch) {
      throw new Error(`Invalid time format: ${timePart}`);
    }
    
    let [_, hours, minutes, ampm] = timeMatch;
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);
    
    if (isNaN(hours) || isNaN(minutes) || hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
      throw new Error('Invalid hours or minutes');
    }
    
    console.log('Time components:', { hours, minutes, ampm });
    
    // Convert to 24h format
    if (ampm.toLowerCase() === 'pm' && hours < 12) hours += 12;
    if (ampm.toLowerCase() === 'am' && hours === 12) hours = 0;
    
    // Convert 2-digit year to full year
    const fullYear = year < 50 ? 2000 + year : 1900 + year;
    
    console.log('Final components:', {
      year: fullYear,
      month: month - 1, // JS months are 0-based
      day,
      hours,
      minutes
    });
    
    const date = new Date(fullYear, month - 1, day, hours, minutes);
    
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date created');
    }
    
    console.log('Final parsed date:', date);
    return date;
  } catch (error) {
    console.error('Error parsing Bandcamp date:', error.message);
    console.error('Original date string:', dateStr);
    throw error; // Let getQuarter handle the error
  }
}

function getQuarter(dateStr, template) {
  try {
    console.log('getQuarter input:', {
      dateStr: dateStr,
      template: template ? template.source : 'no template'
    });

    let date;
    if (template && template.source === 'Bandcamp') {
      console.log('Attempting to parse Bandcamp date');
      date = parseBandcampDate(dateStr);
    } else {
      console.log('Using default date parsing');
      date = new Date(dateStr);
    }

    console.log('Parsed date result:', date);
    
    if (isNaN(date.getTime())) {
      console.error('Invalid date parsing result:', {
        originalDate: dateStr,
        parsedDate: date,
        isValidDate: !isNaN(date.getTime())
      });
      return 'Unknown Quarter';
    }
    
    const quarter = Math.floor((date.getMonth() + 3) / 3);
    const result = `Q${quarter} ${date.getFullYear()}`;
    console.log('Final quarter result:', result);
    return result;
  } catch (error) {
    console.error('Error in getQuarter:', error);
    console.error('Input was:', { dateStr, template });
    return 'Unknown Quarter';
  }
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

function parseCSV(text, template) {
  try {
    console.log('Starting CSV parsing with template:', template);
    const delimiter = detectDelimiter(text);
    console.log('Detected delimiter:', delimiter);
    
    // Afficher les premières lignes du fichier
    const firstFewLines = text.split('\n').slice(0, 5);
    console.log('First few lines of the file:', firstFewLines);
    
    const lines = text.split('\n').filter(line => line.trim());
    console.log('Number of lines after filtering:', lines.length);
    
    // Get headers from first line
    const headers = lines[0].split(delimiter).map(header => header.trim().replace(/^"(.*)"$/, '$1'));
    console.log('Headers found:', headers);
    console.log('Expected headers from template:', {
      date: template.date_column,
      track: template.track_column,
      artist: template.artist_column,
      upc: template.upc_column,
      revenue: template.revenue_column
    });
    
    // Vérifier si les colonnes requises existent
    const requiredColumns = [
      template.date_column,
      template.track_column,
      template.artist_column,
      template.upc_column,
      template.revenue_column
    ];
    
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    if (missingColumns.length > 0) {
      console.error('Missing required columns:', missingColumns);
      console.error('Available columns:', headers);
      throw new Error(`Colonnes manquantes dans le fichier CSV: ${missingColumns.join(', ')}`);
    }

    // Process data lines (skip header)
    const parsedData = lines.slice(1).map((line, index) => {
      try {
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

        // Map values to their corresponding headers
        const result = {};
        headers.forEach((header, index) => {
          result[header] = values[index] || '';
        });
        
        // Log les premières lignes pour débogage
        if (index < 2) {
          console.log(`Parsed row ${index + 1}:`, result);
          console.log('Required values:', {
            date: result[template.date_column],
            track: result[template.track_column],
            artist: result[template.artist_column],
            upc: result[template.upc_column],
            revenue: result[template.revenue_column]
          });
        }
        
        return result;
      } catch (error) {
        console.error(`Error parsing line ${index + 1}:`, line);
        console.error('Error details:', error);
        throw error;
      }
    });

    console.log(`Successfully parsed ${parsedData.length} rows`);
    return parsedData;
  } catch (error) {
    console.error('Error in parseCSV:', error);
    console.error('Template:', template);
    throw error;
  }
}

function aggregateData(data, template) {
  console.log('Starting aggregation with template:', template);
  
  const byArtist = {};
  const byPeriod = {};
  const byTrack = {};
  const bySource = {};
  let totalRevenue = 0;

  data.forEach((row, index) => {
    try {
      const artist = row[template.artist_column] || 'Unknown Artist';
      const track = row[template.track_column] || 'Unknown Track';
      const period = getQuarter(row[template.date_column], template);
      const revenue = parseAmount(row[template.revenue_column] || '0');
      const source = template.source || 'Unknown Source';

      console.log(`Processing row ${index}:`, {
        artist,
        track,
        period,
        revenue,
        source,
        rawRow: row
      });

      // Incrémenter le revenu total
      totalRevenue += revenue;

      // Par source
      if (!bySource[source]) {
        bySource[source] = {
          total: 0,
          periods: {},
          artists: {},
          tracks: {}
        };
      }
      bySource[source].total += revenue;
      
      if (!bySource[source].periods[period]) {
        bySource[source].periods[period] = 0;
      }
      bySource[source].periods[period] += revenue;
      
      if (!bySource[source].artists[artist]) {
        bySource[source].artists[artist] = 0;
      }
      bySource[source].artists[artist] += revenue;
      
      if (!bySource[source].tracks[track]) {
        bySource[source].tracks[track] = 0;
      }
      bySource[source].tracks[track] += revenue;

      // Par artiste
      if (!byArtist[artist]) {
        byArtist[artist] = {
          total: 0,
          tracks: {},
          periods: {},
          sources: {}
        };
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
      
      if (!byArtist[artist].sources[source]) {
        byArtist[artist].sources[source] = 0;
      }
      byArtist[artist].sources[source] += revenue;

      // Par période
      if (!byPeriod[period]) {
        byPeriod[period] = {
          total: 0,
          artists: {},
          tracks: {},
          sources: {}
        };
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
      
      if (!byPeriod[period].sources[source]) {
        byPeriod[period].sources[source] = 0;
      }
      byPeriod[period].sources[source] += revenue;

      // Par track
      if (!byTrack[track]) {
        byTrack[track] = {
          total: 0,
          artist: artist,
          periods: {},
          sources: {}
        };
      }
      byTrack[track].total += revenue;
      
      if (!byTrack[track].periods[period]) {
        byTrack[track].periods[period] = 0;
      }
      byTrack[track].periods[period] += revenue;
      
      if (!byTrack[track].sources[source]) {
        byTrack[track].sources[source] = 0;
      }
      byTrack[track].sources[source] += revenue;
    } catch (error) {
      console.error(`Error processing row ${index}:`, error);
      console.error('Row data:', row);
      console.error('Template:', template);
    }
  });

  const result = { byArtist, byPeriod, byTrack, bySource, totalRevenue };
  console.log('Aggregation result:', result);
  return result;
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
  for (const file of files) {
    const fileData = {
      fileName: file.name,
      fileSize: file.size,
      lastModified: file.lastModified,
      template: template
    };

    try {
      console.log('Processing file:', file.name);
      console.log('Using template:', template);
      
      const content = await readFileAsync(file);
      console.log('File content first 200 chars:', content.substring(0, 200));
      
      const parsedData = parseCSV(content, template);
      console.log('Parsed data first row:', parsedData[0]);
      
      if (parsedData.length === 0) {
        alert('Le fichier est vide ou mal formaté.');
        continue;
      }

      // Agréger les données
      const aggregatedData = aggregateData(parsedData, template);
      console.log('Aggregated data:', aggregatedData);

      // Ajouter les données agrégées au fileData
      fileData.data = aggregatedData;
      
      // Sauvegarder dans le localStorage
      if (saveToLocalStorage(fileData)) {
        console.log(`Fichier "${file.name}" importé et sauvegardé avec succès.`);
      } else {
        console.error(`Erreur lors de la sauvegarde du fichier "${file.name}"`);
      }
      
      // Mettre à jour l'interface
      updateAllViews();
    } catch (error) {
      console.error(`Erreur lors du traitement du fichier "${file.name}":`, error);
      console.error('Template utilisé:', template);
      console.error('Stack trace:', error.stack);
      alert(`Erreur lors du traitement du fichier "${file.name}". Veuillez vérifier le format du fichier.`);
    }
  }
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
        const period = getQuarter(row[template.date_column], template);
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
  console.log('Updating view to:', viewType);
  
  // Check if we're on the import page
  const isImportPage = !document.documentElement.dataset.hideImport;
  
  if (isImportPage) {
    // Cacher toutes les vues
    document.getElementById('artistView').style.display = 'none';
    document.getElementById('periodView').style.display = 'none';
    document.getElementById('trackView').style.display = 'none';
    
    // Afficher la vue sélectionnée
    document.getElementById(viewType + 'View').style.display = 'block';
  }
  
  // Récupérer les données
  const storedFiles = getStoredData();
  console.log('Stored files:', storedFiles);
  
  // Agréger les données
  const aggregatedData = {
    byPeriod: {},
    byArtist: {},
    byTrack: {},
    bySource: {},
    totalRevenue: 0
  };

  // Fusionner les données de tous les fichiers
  storedFiles.forEach(fileData => {
    if (fileData.data) {
      console.log('Processing file data:', fileData);
      mergeObjects(aggregatedData, fileData.data);
    }
  });

  console.log('Aggregated data:', aggregatedData);

  if (isImportPage) {
    // Vider les conteneurs
    document.getElementById('artist-cards').innerHTML = '';
    document.getElementById('period-cards').innerHTML = '';
    document.getElementById('track-cards').innerHTML = '';

    // Mettre à jour l'affichage selon le type de vue
    switch (viewType) {
      case 'artist':
        Object.entries(aggregatedData.byArtist)
          .sort(([, a], [, b]) => b.total - a.total)
          .forEach(([artist, data]) => {
            const card = createArtistCard(artist, data);
            document.getElementById('artist-cards').appendChild(card);
          });
        break;

      case 'period':
        Object.entries(aggregatedData.byPeriod)
          .sort(([a], [b]) => new Date(b) - new Date(a))
          .forEach(([period, data]) => {
            const card = createPeriodCard(period, data);
            document.getElementById('period-cards').appendChild(card);
          });
        break;

      case 'track':
        Object.entries(aggregatedData.byTrack)
          .sort(([, a], [, b]) => b.total - a.total)
          .forEach(([track, data]) => {
            const card = createTrackCard(track, data);
            document.getElementById('track-cards').appendChild(card);
          });
        break;
    }
  }

  // Update charts if we're on the charts page
  const isChartsPage = document.getElementById('chart-revenue-by-period') !== null;
  if (isChartsPage) {
    updateCharts(aggregatedData);
  }
}

// Fonction pour formater la date
function formatImportDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

// Fonction pour générer un ID unique pour le fichier
function generateFileId(fileData, template) {
  const importDate = formatImportDate(new Date());
  const fileName = fileData.fileName.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9]/gi, '_');
  return `${template.source}_${importDate}_${fileName}`;
}

// Fonction pour afficher la liste des fichiers stockés
function displayStoredFiles() {
  const storedFiles = getStoredData();
  console.log('Displaying stored files:', storedFiles);
  
  const container = document.getElementById('stored-files-list') || createStoredFilesContainer();
  
  container.innerHTML = `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Fichiers importés</h3>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-vcenter">
            <thead>
              <tr>
                <th>Source</th>
                <th>Date d'import</th>
                <th>Nom du fichier</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${storedFiles.map(file => `
                <tr>
                  <td>${file.template.source}</td>
                  <td>${new Date(file.importDate).toLocaleDateString('fr-FR')}</td>
                  <td>${file.fileName}</td>
                  <td>
                    <button class="btn btn-danger btn-sm" onclick="removeStoredFile('${file.fileId}')">
                      Supprimer
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  // Only update view if we're on the import page
  const isImportPage = !document.documentElement.dataset.hideImport;
  if (isImportPage) {
    // Get the current view type from radio buttons
    const currentViewRadio = document.querySelector('input[name="viewType"]:checked');
    if (currentViewRadio) {
      updateView(currentViewRadio.value);
    }
  }
}

// Fonction pour créer le conteneur de la liste des fichiers
function createStoredFilesContainer() {
  const container = document.createElement('div');
  container.id = 'stored-files-list';
  container.className = 'mt-3';
  
  // Vérifier si nous sommes sur la page d'import
  const importForms = document.getElementById('importForms');
  if (importForms) {
    importForms.parentNode.insertBefore(container, importForms.nextSibling);
  }
  
  return container;
}

// Fonction pour supprimer un fichier stocké
function removeStoredFile(fileId) {
  try {
    let storedFiles = JSON.parse(localStorage.getItem('csvFiles') || '[]');
    storedFiles = storedFiles.filter(file => file.fileId !== fileId);
    localStorage.setItem('csvFiles', JSON.stringify(storedFiles));
    
    // Mettre à jour l'affichage
    displayStoredFiles();
    // Recalculer et mettre à jour les graphiques
    updateAllViews();
  } catch (error) {
    console.error('Erreur lors de la suppression du fichier:', error);
    alert('Erreur lors de la suppression du fichier');
  }
}

// Fonction globale pour mettre à jour toutes les vues
function updateAllViews() {
  // Récupérer toutes les données stockées
  const storedFiles = getStoredData();
  
  // Agréger les données de tous les fichiers
  const aggregatedData = {
    byPeriod: {},
    byArtist: {},
    byTrack: {},
    bySource: {},
    totalRevenue: 0
  };

  // Fusionner les données de tous les fichiers
  storedFiles.forEach(fileData => {
    if (fileData && fileData.data && fileData.template && fileData.template.source) {
      console.log('Processing file data:', {
        fileName: fileData.fileName,
        template: fileData.template.source,
        data: fileData.data
      });
      mergeObjects(aggregatedData, fileData.data);
    } else {
      console.warn('Skipping invalid file data:', fileData);
    }
  });

  console.log('Final aggregated data:', aggregatedData);

  // Mettre à jour les graphiques avec les données agrégées
  updateCharts(aggregatedData);
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

  // Fusionner les données par source
  if (source.bySource) {
    Object.entries(source.bySource).forEach(([sourceName, data]) => {
      if (!target.bySource[sourceName]) {
        target.bySource[sourceName] = {
          total: 0,
          periods: {},
          artists: {},
          tracks: {}
        };
      }
      target.bySource[sourceName].total += data.total || 0;
      
      // Fusionner les périodes
      if (data.periods) {
        Object.entries(data.periods).forEach(([period, amount]) => {
          target.bySource[sourceName].periods[period] = (target.bySource[sourceName].periods[period] || 0) + amount;
        });
      }
      
      // Fusionner les artistes
      if (data.artists) {
        Object.entries(data.artists).forEach(([artist, amount]) => {
          target.bySource[sourceName].artists[artist] = (target.bySource[sourceName].artists[artist] || 0) + amount;
        });
      }
      
      // Fusionner les tracks
      if (data.tracks) {
        Object.entries(data.tracks).forEach(([track, amount]) => {
          target.bySource[sourceName].tracks[track] = (target.bySource[sourceName].tracks[track] || 0) + amount;
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

function updateCharts(aggregatedData) {
  // Check if we're on the charts page by looking for a key element
  const isChartsPage = document.getElementById('chart-revenue-by-period') !== null;
  if (!isChartsPage) {
    return; // Exit if we're not on the charts page
  }

  // Mise à jour des revenus totaux
  const totalRevenue = aggregatedData.totalRevenue || 0;
  document.getElementById('total-revenue').textContent = formatMoney(totalRevenue);

  // Calculer la tendance par rapport à la période précédente
  const periods = Object.keys(aggregatedData.byPeriod || {}).sort();
  if (periods.length >= 2) {
    const currentPeriod = periods[periods.length - 1];
    const previousPeriod = periods[periods.length - 2];
    const currentRevenue = aggregatedData.byPeriod[currentPeriod].total;
    const previousRevenue = aggregatedData.byPeriod[previousPeriod].total;
    const trend = ((currentRevenue - previousRevenue) / previousRevenue) * 100;
    
    const trendElement = document.getElementById('revenue-trend');
    trendElement.textContent = `${trend.toFixed(1)}%`;
    trendElement.className = trend >= 0 ? 'text-green' : 'text-red';
    
    document.getElementById('revenue-comparison').textContent = 
      `${formatMoney(currentRevenue - previousRevenue)} par rapport à ${previousPeriod}`;
  }

  // Mise à jour du top artiste
  const topArtist = Object.entries(aggregatedData.byArtist || {})
    .sort(([,a], [,b]) => b.total - a.total)[0];
  if (topArtist) {
    document.getElementById('top-artist-revenue').textContent = formatMoney(topArtist[1].total);
    document.getElementById('top-artist-name').textContent = topArtist[0];
    document.getElementById('top-artist-stats').textContent = 
      `${Object.keys(topArtist[1].tracks).length} tracks, ${Object.keys(topArtist[1].periods).length} périodes`;
  }

  // Mise à jour du top track
  const topTrack = Object.entries(aggregatedData.byTrack || {})
    .sort(([,a], [,b]) => b.total - a.total)[0];
  if (topTrack) {
    document.getElementById('top-track-revenue').textContent = formatMoney(topTrack[1].total);
    document.getElementById('top-track-name').textContent = topTrack[0];
    document.getElementById('top-track-stats').textContent = 
      `Par ${topTrack[1].artist}, ${Object.keys(topTrack[1].periods).length} périodes`;
  }

  // Mise à jour de la source principale
  const topSource = Object.entries(aggregatedData.bySource || {})
    .sort(([,a], [,b]) => b.total - a.total)[0];
  if (topSource) {
    document.getElementById('top-source-revenue').textContent = formatMoney(topSource[1].total);
    document.getElementById('top-source-name').textContent = topSource[0];
    document.getElementById('source-stats').textContent = 
      `${Object.keys(topSource[1].tracks).length} tracks, ${Object.keys(topSource[1].periods).length} périodes`;
  }

  // Configuration des graphiques
  const chartOptions = {
    chart: {
      type: 'line',
      height: 96,
      sparkline: {
        enabled: true
      },
      toolbar: {
        show: false
      }
    },
    colors: ['var(--tblr-primary)'],
    stroke: {
      width: 2,
      curve: 'smooth'
    },
    tooltip: {
      fixed: {
        enabled: false
      },
      x: {
        show: false
      },
      marker: {
        show: false
      }
    }
  };

  // Graphique des revenus par période
  if (periods.length > 0) {
    const revenueData = periods.map(period => ({
      x: period,
      y: aggregatedData.byPeriod[period].total
    }));

    new ApexCharts(document.querySelector('#chart-revenue-by-period'), {
      ...chartOptions,
      series: [{
        name: 'Revenus',
        data: revenueData
      }]
    }).render();
  }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
  // Vérifier si nous devons afficher l'interface d'import
  const hideImport = document.documentElement.dataset.hideImport === 'true';
  const isImportPage = !hideImport;
  const isChartsPage = document.getElementById('chart-revenue-by-period') !== null;
  
  // Initialiser les vues et les graphiques
  updateAllViews();
  
  // Si nous ne sommes pas sur la page d'import, ne pas initialiser l'interface d'import
  if (!isImportPage) {
    return;
  }

  // Gérer les changements de template et l'upload de fichiers
  const templateSelects = document.querySelectorAll('.template-select');
  if (templateSelects) {
    templateSelects.forEach(select => {
      select.addEventListener('change', function() {
        currentTemplate = templates[this.value];
        console.log('Selected template:', currentTemplate);
      });
    });
  }

  const fileInputs = document.querySelectorAll('.csv-file');
  if (fileInputs) {
    fileInputs.forEach(input => {
      input.addEventListener('change', function(e) {
        const templateSelect = this.closest('.import-form')?.querySelector('.template-select');
        if (templateSelect) {
          currentTemplate = templates[templateSelect.value];
          if (this.files.length > 0 && currentTemplate) {
            processFiles(this.files, currentTemplate);
          } else {
            alert('Veuillez sélectionner un template et un fichier.');
          }
        }
      });
    });
  }

  // Gérer l'ajout de nouveaux formulaires d'import
  const addImportBtn = document.getElementById('addImportBtn');
  if (addImportBtn) {
    addImportBtn.addEventListener('click', function() {
      const template = document.querySelector('.import-form').cloneNode(true);
      template.querySelector('.csv-file').value = '';
      template.querySelector('.remove-import').style.display = 'block';
      document.getElementById('importForms').appendChild(template);

      // Réinitialiser les événements sur le nouveau formulaire
      const newSelect = template.querySelector('.template-select');
      const newInput = template.querySelector('.csv-file');
      const newRemoveBtn = template.querySelector('.remove-import');

      if (newSelect) {
        newSelect.addEventListener('change', function() {
          currentTemplate = templates[this.value];
        });
      }

      if (newInput) {
        newInput.addEventListener('change', function(e) {
          const templateSelect = this.closest('.import-form')?.querySelector('.template-select');
          if (templateSelect) {
            currentTemplate = templates[templateSelect.value];
            if (this.files.length > 0 && currentTemplate) {
              processFiles(this.files, currentTemplate);
            } else {
              alert('Veuillez sélectionner un template et un fichier.');
            }
          }
        });
      }

      if (newRemoveBtn) {
        newRemoveBtn.addEventListener('click', function() {
          template.remove();
        });
      }
    });
  }

  // Gérer les changements de vue
  const viewTypeRadios = document.querySelectorAll('input[name="viewType"]');
  if (viewTypeRadios) {
    viewTypeRadios.forEach(radio => {
      radio.addEventListener('change', function(e) {
        updateView(e.target.value);
      });
    });
  }

  // Gérer l'export
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', function() {
      const storedFiles = getStoredData();
      storedFiles.forEach(fileData => {
        if (fileData.data && fileData.template) {
          exportToCSV(fileData.data, fileData.template);
        }
      });
    });
  }

  // Initialiser avec le premier template
  const firstTemplateSelect = document.querySelector('.template-select');
  if (firstTemplateSelect) {
    currentTemplate = templates[firstTemplateSelect.value];
  }

  // Créer le conteneur pour les fichiers stockés
  createStoredFilesContainer();
  
  // Afficher les fichiers stockés
  displayStoredFiles();
}); 