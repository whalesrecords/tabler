// Variables globales
let importedFiles = [];
let currentTemplate = null;
let csvData = [];

// Template definitions
window.templates = {
  tunecore: {
    date_column: "Sales Period",
    track_column: "Song Title",
    artist_column: "Artist",
    upc_column: "UPC",
    revenue_column: "Total Earned",
    source_column: "Store Name",
    currency: "Currency",
    source: "Tunecore",
    mapping: {
      "Sales Period": 0,
      "Posted Date": 1,
      "Store Name": 2,
      "Country Of Sale": 3,
      "Artist": 4,
      "Release Type": 5,
      "Release Title": 6,
      "Song Title": 7,
      "Label": 8,
      "UPC": 9,
      "Optional UPC": 10,
      "TC Song ID": 11,
      "Optional ISRC": 12,
      "Sales Type": 13,
      "# Units Sold": 14,
      "Per Unit Price": 15,
      "Net Sales": 16,
      "Net Sales Currency": 17,
      "Exchange Rate": 18,
      "Total Earned": 19,
      "Currency": 20,
      "Commission": 21,
      "Youtube Video ID": 22,
      "Youtube Policy Type": 23
    }
  },
  bandcamp: {
    date_column: "date",
    track_column: "item name",
    artist_column: "artist",
    upc_column: "upc",
    revenue_column: "net amount",
    source_column: "Item Type",
    currency: "EUR",
    source: "Bandcamp",
    mapping: {
      "date": 0,
      "artist": 1,
      "item name": 2,
      "upc": 3,
      "net amount": 4,
      "Item Type": 5
    }
  }
};

// CSV Processing Functions
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

function parseCSV(text) {
  try {
    const delimiter = detectDelimiter(text);
    console.log('Délimiteur détecté:', delimiter);
    const lines = text.split('\n').filter(line => line.trim());
    
    // Log des premières lignes du CSV
    console.log('Premières lignes du CSV:', lines.slice(0, 3));
    
    // Get template information
    const templateSelect = document.querySelector('.template-select');
    if (!templateSelect) {
      throw new Error('Template select element not found');
    }
    
    const templateType = templateSelect.value;
    const template = templates[templateType];
    
    if (!template || !template.mapping) {
      throw new Error(`Invalid template or mapping for type: ${templateType}`);
    }
    
    console.log('Template utilisé:', templateType);
    console.log('Configuration du template:', template);
    
    // Process header line first
    const headers = lines[0].split(delimiter).map(header => header.trim().replace(/^"(.*)"$/, '$1'));
    console.log('En-têtes CSV:', headers);
    
    // Log des colonnes requises et leur correspondance
    const requiredColumns = [
      template.date_column,
      template.track_column,
      template.artist_column,
      template.revenue_column
    ];
    
    console.log('Colonnes requises:', requiredColumns);
    console.log('Correspondance des colonnes:');
    requiredColumns.forEach(col => {
      const index = headers.findIndex(h => h.toLowerCase() === col.toLowerCase());
      console.log(`${col}: ${index !== -1 ? `trouvé à l'index ${index} (${headers[index]})` : 'non trouvé'}`);
    });
    
    // Validate required columns exist
    const missingColumns = requiredColumns.filter(col => {
      const found = headers.some(header => 
        header.toLowerCase() === col.toLowerCase()
      );
      if (!found) {
        console.log(`Colonne "${col}" non trouvée. En-têtes disponibles:`, headers);
      }
      return !found;
    });
    
    if (missingColumns.length > 0) {
      console.error('Colonnes manquantes:', missingColumns);
      console.error('Template utilisé:', template);
      console.error('Type de template:', templateType);
      console.error('En-têtes disponibles:', headers);
      throw new Error(`Colonnes requises manquantes: ${missingColumns.join(', ')}. Veuillez vérifier si vous avez sélectionné le bon template. En-têtes disponibles: ${headers.join(', ')}`);
    }
    
    // Process data rows
    const processedData = lines.slice(1).map((line, index) => {
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
        
        // Log des premières lignes de données
        if (index < 3) {
          console.log(`Ligne ${index + 1} - Valeurs:`, values);
          console.log(`Ligne ${index + 1} - Mapping:`, {
            date: values[template.mapping[template.date_column]],
            track: values[template.mapping[template.track_column]],
            artist: values[template.mapping[template.artist_column]],
            revenue: values[template.mapping[template.revenue_column]]
          });
        }
        
        // Create result object with default values
        const result = {
          [template.date_column]: '',
          [template.track_column]: '',
          [template.artist_column]: '',
          [template.upc_column]: '',
          [template.revenue_column]: '0',
          [template.source_column]: template.source
        };
        
        // Map values to their corresponding headers
        headers.forEach((header, idx) => {
          if (values[idx] !== undefined) {
            result[header] = values[idx];
          }
        });
        
        return result;
      } catch (error) {
        console.error(`Erreur lors du traitement de la ligne ${index + 1}:`, error);
        return null;
      }
    }).filter(row => row !== null);

    console.log('Nombre total de lignes traitées:', processedData.length);
    console.log('Exemple de données traitées:', processedData.slice(0, 3));
    
    return processedData;
  } catch (error) {
    console.error('Erreur lors du parsing CSV:', error);
    alert(`Erreur lors du parsing CSV: ${error.message}`);
    return [];
  }
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

      // ... rest of the existing aggregateData function ...
    } catch (error) {
      console.error(`Error processing row ${index}:`, error);
    }
  });

  // ... rest of the existing aggregateData function ...
}

// Utility functions for data compression
function compressData(data) {
  try {
    // Convert to string and compress
    const jsonString = JSON.stringify(data);
    const compressed = LZString.compress(jsonString);
    return compressed;
  } catch (error) {
    console.error('Error compressing data:', error);
    return null;
  }
}

function decompressData(compressed) {
  try {
    // Decompress and parse
    const jsonString = LZString.decompress(compressed);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error decompressing data:', error);
    return null;
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
  // Restore saved data if exists
  const savedData = localStorage.getItem('csvData');
  const savedTemplate = localStorage.getItem('csvTemplate');
  const savedFiles = JSON.parse(localStorage.getItem('csvFiles') || '[]');
  
  // Initialiser les variables globales avec les données sauvegardées
  importedFiles = savedFiles;
  currentTemplate = savedTemplate;
  
  if (savedData && savedTemplate) {
    const decompressedData = decompressData(savedData);
    const template = templates[savedTemplate];
    if (decompressedData && template) {
      csvData = decompressedData;
      displayCSVData(decompressedData, template);
    }
  }

  // Handle file inputs for all import forms
  document.querySelectorAll('.import-form').forEach(form => {
    const fileInput = form.querySelector('.csv-file');
    const templateSelect = form.querySelector('.template-select');
    
    if (fileInput && templateSelect) {
      // Ajouter les options de gestion des doublons
      const duplicateOptions = document.createElement('div');
      duplicateOptions.className = 'mb-3';
      duplicateOptions.innerHTML = `
        <label class="form-label">Gestion des doublons</label>
        <div class="form-selectgroup">
          <label class="form-selectgroup-item">
            <input type="radio" name="duplicate-handling" value="ignore" class="form-selectgroup-input" checked>
            <span class="form-selectgroup-label">Ignorer les doublons</span>
          </label>
          <label class="form-selectgroup-item">
            <input type="radio" name="duplicate-handling" value="add" class="form-selectgroup-input">
            <span class="form-selectgroup-label">Ajouter les doublons</span>
          </label>
        </div>
      `;
      // Insérer après le template select au lieu de avant le file input
      templateSelect.parentNode.insertBefore(duplicateOptions, templateSelect.nextSibling);

      fileInput.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
          const templateType = templateSelect.value;
          const template = templates[templateType];
          const duplicateHandling = form.querySelector('input[name="duplicate-handling"]:checked').value;
        
          if (!template) {
            alert('Veuillez sélectionner un template valide');
            return;
          }
        
          // Sauvegarder les informations des fichiers
          const fileInfos = files.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            template: templateType
          }));

          // Mettre à jour la liste des fichiers sauvegardés
          const savedFiles = JSON.parse(localStorage.getItem('csvFiles') || '[]');
          savedFiles.push(...fileInfos);
          localStorage.setItem('csvFiles', JSON.stringify(savedFiles));

          // Process all selected files
          Promise.all(files.map(file => {
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = function(e) {
                const text = e.target.result;
                console.log('File content:', text.substring(0, 200));
                const data = parseCSV(text);
                resolve(data);
              };
              reader.onerror = reject;
              reader.readAsText(file);
            });
          })).then(results => {
            // Combine all results
            const combinedData = results.flat();
            
            // Vérifier les doublons
            const existingData = localStorage.getItem('csvData');
            let finalData = combinedData;
            
            if (existingData) {
              const decompressedExisting = decompressData(existingData);
              if (decompressedExisting) {
                if (duplicateHandling === 'ignore') {
                  const existingKeys = new Set(decompressedExisting.map(row => 
                    `${row[template.date_column]}|${row[template.track_column]}|${row[template.artist_column]}|${row[template.upc_column]}`
                  ));
                  
                  finalData = combinedData.filter(row => {
                    const key = `${row[template.date_column]}|${row[template.track_column]}|${row[template.artist_column]}|${row[template.upc_column]}`;
                    return !existingKeys.has(key);
                  });
                  
                  finalData = [...decompressedExisting, ...finalData];
                  
                  const duplicatesCount = combinedData.length - finalData.length + decompressedExisting.length;
                  if (duplicatesCount > 0) {
                    alert(`${duplicatesCount} doublons ont été détectés et ignorés.`);
                  }
                } else {
                  // Ajouter tous les doublons
                  finalData = [...decompressedExisting, ...combinedData];
                }
              }
            }
            
            // Compress and save data
            const compressedData = compressData(finalData);
            if (compressedData) {
              localStorage.setItem('csvData', compressedData);
              localStorage.setItem('csvTemplate', templateType);
            } else {
              console.error('Failed to compress data');
            }
            
            displayCSVData(finalData, template);
            
            if (typeof aggregateData === 'function') {
              const aggregated = aggregateData(finalData, template);
              const compressedAggregated = compressData(aggregated);
              if (compressedAggregated) {
                localStorage.setItem('royaltiesResults', compressedAggregated);
              }
            }
          }).catch(error => {
            console.error('Error processing files:', error);
            alert('Erreur lors du traitement des fichiers');
          });
        }
      });
    }
  });

  // Add import form button handler
  const addImportBtn = document.getElementById('addImportBtn');
  if (addImportBtn) {
    addImportBtn.addEventListener('click', function() {
      const importForms = document.getElementById('importForms');
      if (!importForms) return;

      const newForm = document.querySelector('.import-form').cloneNode(true);
      
      // Clear file input
      const fileInput = newForm.querySelector('.csv-file');
      if (fileInput) fileInput.value = '';
      
      // Show remove button
      const removeBtn = newForm.querySelector('.remove-import');
      if (removeBtn) removeBtn.style.display = 'block';
      
      // Add remove button handler
      if (removeBtn) {
        removeBtn.addEventListener('click', function() {
          newForm.remove();
        });
      }
      
      importForms.appendChild(newForm);
    });
  }

  // Add clear data button handler
  const clearDataBtn = document.createElement('button');
  clearDataBtn.className = 'btn btn-danger ms-2';
  clearDataBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trash" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M4 7l16 0"></path>
      <path d="M10 11l0 6"></path>
      <path d="M14 11l0 6"></path>
      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
    </svg>
    Effacer les données
  `;
  clearDataBtn.onclick = function() {
    if (confirm('Êtes-vous sûr de vouloir effacer toutes les données ?')) {
      localStorage.removeItem('csvData');
      localStorage.removeItem('csvTemplate');
      localStorage.removeItem('royaltiesResults');
      location.reload();
    }
  };

  const headerActions = document.querySelector('.d-flex.justify-content-end');
  if (headerActions) {
    headerActions.appendChild(clearDataBtn);
  }
});

function updateRevenueTable(data, template) {
  const artistFilter = document.getElementById('artistFilter')?.value || '';
  const periodFilter = document.getElementById('periodFilter')?.value || '';
  const sourceFilter = document.getElementById('sourceFilter')?.value || '';

  // Filtrer les données
  const filteredData = data.filter(row => {
    const artist = row[template.artist_column];
    const period = getQuarter(row[template.date_column], template);
    const source = template.source;

    return (!artistFilter || artist === artistFilter) &&
           (!periodFilter || period === periodFilter) &&
           (!sourceFilter || source === sourceFilter);
  });

  // Agréger les données
  const revenueByArtist = {};
  filteredData.forEach(row => {
    const artist = row[template.artist_column];
    const period = getQuarter(row[template.date_column], template);
    const source = template.source;
    const revenue = parseFloat(row[template.revenue_column] || 0);

    const key = `${artist}|${period}|${source}`;
    if (!revenueByArtist[key]) {
      revenueByArtist[key] = {
        artist,
        period,
        source,
        revenue: 0
      };
    }
    revenueByArtist[key].revenue += revenue;
  });

  // Mettre à jour le tableau
  const tbody = document.getElementById('revenueTableBody');
  if (!tbody) {
    console.warn('Element revenueTableBody non trouvé');
    return;
  }

  tbody.innerHTML = '';

  let totalRevenue = 0;
  Object.values(revenueByArtist)
    .sort((a, b) => {
      if (a.artist !== b.artist) return a.artist.localeCompare(b.artist);
      if (a.period !== b.period) return a.period.localeCompare(b.period);
      return a.source.localeCompare(b.source);
    })
    .forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.artist}</td>
        <td>${item.period}</td>
        <td>${item.source}</td>
        <td>${formatAmount(item.revenue)}</td>
      `;
      tbody.appendChild(tr);
      totalRevenue += item.revenue;
    });

  // Mettre à jour le total
  const totalRevenueElement = document.getElementById('totalRevenue');
  if (totalRevenueElement) {
    totalRevenueElement.textContent = formatAmount(totalRevenue);
  }
}

function formatAmount(value) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
}

// Function to display CSV data
function displayCSVData(data, template) {
  // Vérifier si nous sommes sur la page des graphiques
  const isChartsPage = window.location.pathname.includes('royalties-charts');
  
  if (isChartsPage) {
    // Code existant pour la page des graphiques
    const tbody = document.querySelector(".table-tbody");
    if (!tbody) return;
    
    tbody.innerHTML = "";
    
    if (data.length === 0) {
      const noResults = document.createElement('tr');
      noResults.className = 'no-results';
      noResults.innerHTML = '<td colspan="6" class="text-center">Aucune donnée à afficher</td>';
      tbody.appendChild(noResults);
      return;
    }

    // ... rest of the existing displayCSVData code for charts page ...
  } else {
    // Pour la page des royalties, on crée d'abord la section d'import si elle n'existe pas
    const mainContainer = document.querySelector('.page-body .container-xl');
    if (!mainContainer) return;

    // Créer la section d'import si elle n'existe pas
    let importSection = document.getElementById('importSection');
    if (!importSection) {
      importSection = document.createElement('div');
      importSection.id = 'importSection';
      importSection.className = 'card mt-3';
      importSection.innerHTML = `
        <div class="card-header">
          <h3 class="card-title">Importer des fichiers CSV</h3>
        </div>
        <div class="card-body">
          <div id="importForms">
            <div class="import-form mb-3">
              <div class="row g-3">
                <div class="col-md-4">
                  <label class="form-label">Template</label>
                  <select class="form-select template-select">
                    <option value="tunecore">Tunecore</option>
                    <option value="bandcamp">Bandcamp</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Fichier CSV</label>
                  <input type="file" class="form-control csv-file" accept=".csv">
                </div>
                <div class="col-md-2">
                  <label class="form-label">&nbsp;</label>
                  <button class="btn btn-danger d-block w-100 remove-import" style="display: none;">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trash" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M4 7l16 0"></path>
                      <path d="M10 11l0 6"></path>
                      <path d="M14 11l0 6"></path>
                      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
                      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
                    </svg>
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-3">
            <button class="btn btn-primary" id="addImportBtn">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-plus" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M12 5l0 14"></path>
                <path d="M5 12l14 0"></path>
              </svg>
              Ajouter un autre fichier
            </button>
          </div>
        </div>
      `;
      mainContainer.appendChild(importSection);

      // Ajouter les gestionnaires d'événements pour l'import
      const addImportBtn = document.getElementById('addImportBtn');
      if (addImportBtn) {
        addImportBtn.addEventListener('click', function() {
          const importForms = document.getElementById('importForms');
          if (!importForms) return;

          const newForm = document.querySelector('.import-form').cloneNode(true);
          
          // Clear file input
          const fileInput = newForm.querySelector('.csv-file');
          if (fileInput) fileInput.value = '';
          
          // Show remove button
          const removeBtn = newForm.querySelector('.remove-import');
          if (removeBtn) removeBtn.style.display = 'block';
          
          // Add remove button handler
          if (removeBtn) {
            removeBtn.addEventListener('click', function() {
              newForm.remove();
            });
          }
          
          importForms.appendChild(newForm);
        });
      }

      // Ajouter les gestionnaires d'événements pour les formulaires d'import
      document.querySelectorAll('.import-form').forEach(form => {
        const fileInput = form.querySelector('.csv-file');
        const templateSelect = form.querySelector('.template-select');
        
        if (fileInput && templateSelect) {
          fileInput.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            if (files.length > 0) {
              const templateType = templateSelect.value;
              const template = templates[templateType];
              
              if (!template) {
                alert('Veuillez sélectionner un template valide');
                return;
              }

              // Process all selected files
              Promise.all(files.map(file => {
                return new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onload = function(e) {
                    const text = e.target.result;
                    const data = parseCSV(text);
                    resolve(data);
                  };
                  reader.onerror = reject;
                  reader.readAsText(file);
                });
              })).then(results => {
                // Combine all results
                const combinedData = results.flat();
                
                // Compress and save data
                const compressedData = compressData(combinedData);
                if (compressedData) {
                  localStorage.setItem('csvData', compressedData);
                  localStorage.setItem('csvTemplate', templateType);
                }
                
                displayCSVData(combinedData, template);
              }).catch(error => {
                console.error('Error processing files:', error);
                alert('Erreur lors du traitement des fichiers');
              });
            }
          });
        }
      });
    }

    // Supprimer l'ancienne section de récapitulatif si elle existe
    const oldSummarySection = document.getElementById('summarySection');
    if (oldSummarySection) {
      oldSummarySection.remove();
    }

    // Créer la section de récapitulatif des revenus
    const summarySection = document.createElement('div');
    summarySection.id = 'summarySection';
    summarySection.className = 'card mt-3';
    summarySection.innerHTML = `
      <div class="card-header d-flex justify-content-between align-items-center">
        <h3 class="card-title">Récapitulatif des Revenus</h3>
        <button class="btn btn-primary" onclick="exportToCSV()">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-download" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"></path>
            <path d="M7 11l5 5l5 -5"></path>
            <path d="M12 4l0 12"></path>
          </svg>
          Exporter en CSV
        </button>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-vcenter card-table">
            <thead>
              <tr>
                <th>Artiste</th>
                <th>Période</th>
                <th>Source</th>
                <th class="text-end">Revenus</th>
              </tr>
            </thead>
            <tbody id="summaryTableBody">
            </tbody>
            <tfoot>
              <tr class="table-secondary">
                <td colspan="3" class="text-end fw-bold">Total global</td>
                <td class="text-end fw-bold" id="totalRevenue">0.00 €</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    `;
    mainContainer.appendChild(summarySection);

    // Mettre à jour le tableau de récapitulatif
    const summaryTableBody = document.getElementById('summaryTableBody');
    if (!summaryTableBody) return;

    // Calculer les totaux par artiste
    const revenueByArtist = {};
    let totalRevenue = 0;

    data.forEach(row => {
      const artist = row[template.artist_column];
      const period = getQuarter(row[template.date_column], template);
      const source = template.source;
      const revenue = parseFloat(row[template.revenue_column] || 0);

      const key = `${artist}|${period}|${source}`;
      if (!revenueByArtist[key]) {
        revenueByArtist[key] = {
          artist,
          period,
          source,
          revenue: 0
        };
      }
      revenueByArtist[key].revenue += revenue;
      totalRevenue += revenue;
    });

    // Mettre à jour le tableau
    summaryTableBody.innerHTML = '';
    
    // Trier les données par artiste, période et source
    Object.values(revenueByArtist)
      .sort((a, b) => {
        if (a.artist !== b.artist) return a.artist.localeCompare(b.artist);
        if (a.period !== b.period) return a.period.localeCompare(b.period);
        return a.source.localeCompare(b.source);
      })
      .forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${item.artist}</td>
          <td>${item.period}</td>
          <td>${item.source}</td>
          <td class="text-end">${formatAmount(item.revenue)}</td>
        `;
        summaryTableBody.appendChild(tr);
      });

    // Mettre à jour le total
    const totalRevenueElement = document.getElementById('totalRevenue');
    if (totalRevenueElement) {
      totalRevenueElement.textContent = formatAmount(totalRevenue);
    }
  }
}

// Fonction pour exporter les données en CSV
window.exportToCSV = function() {
  const savedData = localStorage.getItem('csvData');
  const savedTemplate = localStorage.getItem('csvTemplate');
  
  if (!savedData || !savedTemplate) {
    alert('Aucune donnée à exporter');
    return;
  }

  const decompressedData = decompressData(savedData);
  const template = templates[savedTemplate];
  
  if (!decompressedData || !template) {
    alert('Erreur lors de la récupération des données');
    return;
  }

  // Calculer les totaux par artiste
  const artistTotals = {};
  decompressedData.forEach(row => {
    const artist = row[template.artist_column];
    if (!artistTotals[artist]) {
      artistTotals[artist] = {
        artist: artist,
        source: template.source,
        period: 'Toutes périodes',
        revenue: 0
      };
    }
    const revenue = parseFloat(row[template.revenue_column] || 0);
    if (!isNaN(revenue)) {
      artistTotals[artist].revenue += revenue;
    }
  });

  // Convertir en tableau et trier par revenus décroissants
  const dataArray = Object.values(artistTotals).sort((a, b) => b.revenue - a.revenue);

  // Ajouter le total global
  const globalTotal = dataArray.reduce((sum, row) => sum + row.revenue, 0);
  dataArray.push({
    artist: 'TOTAL GLOBAL',
    source: template.source,
    period: 'Toutes périodes',
    revenue: globalTotal
  });

  // Créer le contenu CSV
  const headers = ['Artiste', 'Source', 'Période', 'Revenus totaux'];
  const csvContent = [
    headers.join(','),
    ...dataArray.map(row => [
      `"${row.artist}"`,
      `"${row.source}"`,
      `"${row.period}"`,
      row.revenue.toFixed(2)
    ].join(','))
  ].join('\n');

  // Créer le blob et le lien de téléchargement
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  // Définir le nom du fichier avec la date actuelle
  const date = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `royalties_totaux_${date}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Fonction pour effacer tous les fichiers
window.clearAllFiles = function() {
  if (confirm('Êtes-vous sûr de vouloir effacer tous les fichiers et leurs données ?')) {
    // Effacer toutes les données du localStorage
    localStorage.removeItem('csvData');
    localStorage.removeItem('csvTemplate');
    localStorage.removeItem('csvFiles');
    localStorage.removeItem('royaltiesResults');
    
    // Réinitialiser l'affichage
    const summaryTableBody = document.getElementById('summaryTableBody');
    if (summaryTableBody) {
      summaryTableBody.innerHTML = '<tr class="no-results"><td colspan="4" class="text-center">Aucune donnée à afficher</td></tr>';
    }
    
    const totalRevenueElement = document.getElementById('totalRevenue');
    if (totalRevenueElement) {
      totalRevenueElement.textContent = formatAmount(0);
    }
  }
};

// Make functions globally available
window.displayCSVData = displayCSVData;
window.parseCSV = parseCSV;
window.detectDelimiter = detectDelimiter; 