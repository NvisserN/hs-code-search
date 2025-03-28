let allData = [];
let sections = [];
let searchHistory = [];

// Laad de data wanneer de pagina wordt geladen
document.addEventListener('DOMContentLoaded', function() {
    // Data is al geladen via data.js
    sections = [...new Set(hsData.map(item => item.sectie))].sort();
    
    // Laad zoekgeschiedenis uit localStorage
    loadSearchHistory();
    
    // Vul de sectie dropdown
    const categorySelect = document.getElementById('category');
    sections.forEach(section => {
        const option = document.createElement('option');
        option.value = section;
        option.textContent = section;
        categorySelect.appendChild(option);
    });
    
    // Voeg event listeners toe
    document.getElementById('search').addEventListener('input', handleSearch);
    document.getElementById('category').addEventListener('change', filterResults);
    
    // Toon initiële resultaten
    filterResults();
});

function handleSearch() {
    const searchTerm = document.getElementById('search').value.trim();
    
    // Voeg toe aan zoekgeschiedenis als het niet leeg is
    if (searchTerm && searchTerm.length >= 2) {
        addToSearchHistory(searchTerm);
    }
    
    filterResults();
}

function addToSearchHistory(term) {
    // Voeg nieuwe zoekterm toe aan het begin
    searchHistory = [term, ...searchHistory.filter(item => item !== term)];
    
    // Houd maximaal 10 items
    searchHistory = searchHistory.slice(0, 10);
    
    // Update localStorage
    localStorage.setItem('hsCodeSearchHistory', JSON.stringify(searchHistory));
    
    // Update UI
    updateSearchHistoryUI();
}

function loadSearchHistory() {
    const saved = localStorage.getItem('hsCodeSearchHistory');
    if (saved) {
        searchHistory = JSON.parse(saved);
        updateSearchHistoryUI();
    }
}

function updateSearchHistoryUI() {
    const container = document.getElementById('searchHistory');
    container.innerHTML = '';
    
    searchHistory.forEach(term => {
        const div = document.createElement('div');
        div.className = 'search-history-item';
        div.textContent = term;
        div.onclick = () => {
            document.getElementById('search').value = term;
            filterResults();
        };
        container.appendChild(div);
    });
}

function filterResults() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const selectedSection = document.getElementById('category').value;
    
    // Filter de data
    let filteredData = hsData.filter(item => {
        const matchesSearch = 
            item.code.toString().includes(searchTerm) ||
            item.omschrijving.toLowerCase().includes(searchTerm);
            
        const matchesSection = 
            !selectedSection || 
            item.sectie === selectedSection;
            
        return matchesSearch && matchesSection;
    });
    
    // Beperk tot maximaal 100 resultaten voor performance
    filteredData = filteredData.slice(0, 100);
    
    // Update de tabel
    const tbody = document.getElementById('results');
    tbody.innerHTML = '';
    
    filteredData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.code}</td>
            <td>${item.sectie}</td>
            <td>${item.hoofdstuk}</td>
            <td>${item.omschrijving}</td>
        `;
        tbody.appendChild(row);
    });
    
    // Update resultaat teller
    updateResultCount(filteredData.length, hsData.length);
}

function updateResultCount(filtered, total) {
    const resultsTable = document.querySelector('.results-table');
    const countDiv = document.querySelector('.result-count') || document.createElement('div');
    countDiv.className = 'result-count text-muted mb-2';
    countDiv.textContent = `Toont ${filtered} van ${total} resultaten`;
    
    if (!document.querySelector('.result-count')) {
        resultsTable.insertBefore(countDiv, resultsTable.firstChild);
    }
}

function exportToExcel() {
    // Krijg de huidige gefilterde data
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const selectedSection = document.getElementById('category').value;
    
    let dataToExport = hsData.filter(item => {
        const matchesSearch = 
            item.code.toString().includes(searchTerm) ||
            item.omschrijving.toLowerCase().includes(searchTerm);
            
        const matchesSection = 
            !selectedSection || 
            item.sectie === selectedSection;
            
        return matchesSearch && matchesSection;
    });
    
    // Converteer naar het juiste format voor Excel
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "HS Codes");
    
    // Download het bestand
    XLSX.writeFile(wb, "hs_codes_export.xlsx");
}
