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
  const delimiter = detectDelimiter(text);
  console.log('Detected delimiter:', delimiter);
  const lines = text.split('\n').filter(line => line.trim());
  
  return lines.map(line => {
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
    
    // Create an object with all headers from the template mapping
    const templateType = document.getElementById('templateSelect').value;
    const template = templates[templateType];
    
    if (!template || !template.mapping) {
      console.error('Template or mapping not found');
      return {};
    }

    const result = {};
    Object.entries(template.mapping).forEach(([header, index]) => {
      result[header] = values[index] || '';
    });
    
    return result;
  });
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