// Template definitions
const templates = {
  tunecore: {
    date_column: "Start Date",
    track_column: "Track Title",
    artist_column: "Artist Name",
    upc_column: "UPC",
    revenue_column: "Net EUR",
    source_column: "Store",
    currency: "EUR",
    source: "Tunecore",
    mapping: {
      "Start Date": 0,      // 2025-01-01
      "End Date": 1,        // 2025-05-14
      "Store": 2,           // TikTok
      "Country": 3,         // DE
      "Artist Name": 4,     // AINO & Hélène Vogelsinger
      "Type": 5,            // Song
      "Track Title": 6,     // Contemplation (Rework)
      "Release": 7,         // Contemplation (Rework)
      "Label": 8,           // Whales Records
      "UPC": 9,            // 859785750927
      "ISRC": 10,          // empty
      "Cat Ref": 11,       // TCAIB2408666
      "Product Ref": 12,   // TCAIB2408666
      "Sale Type": 13,     // Streaming
      "Quantity": 14,      // 1
      "Gross USD": 15,     // 0.0019911951123
      "Net USD": 16,       // 0.00156109696805
      "Currency": 17,      // USD
      "Exchange Rate": 18, // 0.880204
      "Gross EUR": 19,     // 0.001374
      "Currency EUR": 20,  // EUR
      "Net EUR": 21       // 0.00039027424201
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
    console.log('Detected delimiter:', delimiter);
    const lines = text.split('\n').filter(line => line.trim());
    
    // Get template information
    const templateSelect = document.getElementById('templateSelect');
    if (!templateSelect) {
      throw new Error('Template select element not found');
    }
    
    const templateType = templateSelect.value;
    const template = templates[templateType];
    
    if (!template || !template.mapping) {
      throw new Error(`Invalid template or mapping for type: ${templateType}`);
    }
    
    console.log('Using template:', templateType, template);
    
    // Process header line first
    const headers = lines[0].split(delimiter).map(header => header.trim().replace(/^"(.*)"$/, '$1'));
    console.log('CSV Headers:', headers);
    
    // Validate required columns exist
    const requiredColumns = [
      template.date_column,
      template.track_column,
      template.artist_column,
      template.revenue_column
    ];
    
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    if (missingColumns.length > 0) {
      throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
    }
    
    // Process data rows
    return lines.slice(1).map((line, index) => {
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
        console.error(`Error processing row ${index + 1}:`, error);
        return null;
      }
    }).filter(row => row !== null); // Remove any rows that failed to parse
  } catch (error) {
    console.error('Error parsing CSV:', error);
    alert(`Error parsing CSV: ${error.message}`);
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

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
  // Initialize List.js
  window.listInstance = new List("table-default", {
    sortClass: "table-sort",
    listClass: "table-tbody",
    valueNames: [
      "sort-artist",
      "sort-title",
      "sort-upc",
      "sort-period",
      "sort-revenues",
      "sort-source"
    ],
    page: 5,
    pagination: true
  });

  // File input change handler
  document.getElementById('csvFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const text = e.target.result;
        console.log('File content:', text.substring(0, 200)); // Log first 200 chars
        const data = parseCSV(text);
        const templateType = document.getElementById('templateSelect').value;
        const template = templates[templateType];
        
        if (!template) {
          alert('Veuillez sélectionner un template valide');
          return;
        }
        
        displayCSVData(data, template);
      };
      reader.readAsText(file);
    }
  });

  // Function to display CSV data
  function displayCSVData(data, template) {
    const tbody = document.querySelector(".table-tbody");
    tbody.innerHTML = "";
    
    // Display only first 5 rows initially
    const initialRows = data.slice(0, 5);
    initialRows.forEach(row => {
      const tr = createTableRow(row, template);
      tbody.appendChild(tr);
    });

    // Add "Show More" button if there are more rows
    const existingShowMoreBtn = document.getElementById('showMoreButton');
    if (existingShowMoreBtn) {
      existingShowMoreBtn.remove();
    }

    if (data.length > 5) {
      const showMoreBtn = document.createElement("button");
      showMoreBtn.id = "showMoreButton";
      showMoreBtn.className = "btn btn-primary mt-3";
      showMoreBtn.textContent = "Voir plus";
      showMoreBtn.onclick = () => {
        const remainingRows = data.slice(5);
        remainingRows.forEach(row => {
          const tr = createTableRow(row, template);
          tbody.appendChild(tr);
        });
        showMoreBtn.style.display = "none";
      };
      tbody.parentElement.after(showMoreBtn);
    }

    window.listInstance.update();
  }

  // Helper function to create table row
  function createTableRow(rowData, template) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="sort-artist">${rowData[template.artist_column] || ''}</td>
      <td class="sort-title">${rowData[template.track_column] || ''}</td>
      <td class="sort-upc">${rowData[template.upc_column] || ''}</td>
      <td class="sort-period">${rowData[template.date_column] || ''}</td>
      <td class="sort-revenues text-end">${formatRevenue(rowData[template.revenue_column])}</td>
      <td class="sort-source">${rowData[template.source_column] || template.source}</td>
    `;
    return tr;
  }

  // Helper function to format revenue
  function formatRevenue(value) {
    if (!value) return '0.00';
    const num = parseFloat(value.toString().replace(',', '.'));
    return num.toFixed(2);
  }

  // Make functions globally available
  window.displayCSVData = displayCSVData;
  window.parseCSV = parseCSV;
  window.detectDelimiter = detectDelimiter;
}); 