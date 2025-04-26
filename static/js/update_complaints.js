// static/js/update_camplain.js
document.addEventListener('DOMContentLoaded', function() {
    // Add loading indicator
    addLoadingIndicator();
    
    // Add search functionality
    addSearchField();
    
    // Make table sortable
    makeTableSortable();
    
    // Add status badges
    styleStatusCells();
    
    // Add button effects
    addButtonEffects();
    
    // Add row animations
    animateRows();
});

function addLoadingIndicator() {
    // Create loading bar
    const loading = document.createElement('div');
    loading.classList.add('loading');
    document.body.appendChild(loading);
    
    // Remove loading bar after content loads
    window.addEventListener('load', function() {
        setTimeout(function() {
            loading.style.opacity = '0';
            setTimeout(function() {
                loading.remove();
            }, 300);
        }, 500);
    });
}

function addSearchField() {
    // Create search box
    const searchBox = document.createElement('div');
    searchBox.classList.add('search-box');
    searchBox.innerHTML = `<input type="text" id="searchInput" placeholder="Search complaints...">`;
    
    // Insert before table
    const container = document.querySelector('.update-camplain-container');
    const table = container.querySelector('table');
    container.insertBefore(searchBox, table);
    
    // Add search functionality
    const searchInput = document.getElementById('searchInput');
    const tbody = document.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');
    
    searchInput.addEventListener('input', function() {
        const searchText = this.value.toLowerCase();
        let resultsFound = false;
        
        rows.forEach(row => {
            const rowText = row.textContent.toLowerCase();
            if (rowText.includes(searchText)) {
                row.style.display = '';
                resultsFound = true;
                
                // Highlight the matching text
                highlightMatches(row, searchText);
            } else {
                row.style.display = 'none';
            }
        });
        
        // Show "no results" message if needed
        showNoResultsMessage(resultsFound, tbody);
    });
}

function highlightMatches(row, searchText) {
    if (!searchText) {
        // Remove highlights if search is empty
        const highlights = row.querySelectorAll('.highlight');
        highlights.forEach(highlight => {
            const parent = highlight.parentNode;
            parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
            parent.normalize();
        });
        return;
    }
    
    // Check each cell for text to highlight
    const cells = row.querySelectorAll('td');
    cells.forEach(cell => {
        // Skip cells with forms or complex content
        if (cell.querySelector('form')) return;
        
        const originalText = cell.textContent;
        
        // Remove existing highlights first to prevent nested highlights
        const highlights = cell.querySelectorAll('.highlight');
        if (highlights.length > 0) {
            cell.textContent = originalText;
        }
        
        if (searchText && originalText.toLowerCase().includes(searchText.toLowerCase())) {
            const regex = new RegExp(`(${searchText})`, 'gi');
            cell.innerHTML = originalText.replace(regex, '<span class="highlight">$1</span>');
            
            // Add style for highlight
            const style = document.createElement('style');
            style.textContent = `
                .highlight {
                    background-color: #fff176;
                    padding: 2px;
                    border-radius: 2px;
                }
            `;
            document.head.appendChild(style);
        }
    });
}

function showNoResultsMessage(resultsFound, tbody) {
    // Remove existing message if it exists
    const existingMsg = document.querySelector('.no-results');
    if (existingMsg) existingMsg.remove();
    
    if (!resultsFound) {
        const noResults = document.createElement('tr');
        noResults.classList.add('no-results');
        noResults.innerHTML = '<td colspan="5">No matching complaints found</td>';
        tbody.appendChild(noResults);
    }
}

function makeTableSortable() {
    const table = document.querySelector('table');
    const headers = table.querySelectorAll('thead th');
    const tbody = table.querySelector('tbody');
    
    headers.forEach((header, index) => {
        // Skip action column
        if (index === 4) return;
        
        header.addEventListener('click', function() {
            // Reset all headers
            headers.forEach(h => {
                h.classList.remove('asc', 'desc');
            });
            
            // Set sort direction
            const sortDirection = this.classList.contains('asc') ? 'desc' : 'asc';
            this.classList.add(sortDirection);
            
            // Sort table
            sortTableByColumn(tbody, index, sortDirection);
        });
    });
}

function sortTableByColumn(tbody, columnIndex, direction) {
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const sortedRows = rows.sort((a, b) => {
        // Ignore no-results row
        if (a.classList.contains('no-results')) return 1;
        if (b.classList.contains('no-results')) return -1;
        
        const aValue = a.querySelector(`td:nth-child(${columnIndex + 1})`).textContent.trim();
        const bValue = b.querySelector(`td:nth-child(${columnIndex + 1})`).textContent.trim();
        
        // Check if values are numbers
        const aNum = parseFloat(aValue);
        const bNum = parseFloat(bValue);
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return direction === 'asc' ? aNum - bNum : bNum - aNum;
        }
        
        // Sort strings
        return direction === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
    });
    
    // Apply sort animation
    rows.forEach(row => {
        row.classList.add('sorting');
        setTimeout(() => {
            row.classList.remove('sorting');
        }, 500);
    });
    
    // Append in new order
    sortedRows.forEach(row => {
        tbody.appendChild(row);
    });
    
    // Add style for sort animation
    const style = document.createElement('style');
    style.textContent = `
        .sorting {
            background-color: rgba(63, 81, 181, 0.1);
            transition: background-color 0.5s ease;
        }
    `;
    document.head.appendChild(style);
}

function styleStatusCells() {
    const statusCells = document.querySelectorAll('tbody td:nth-child(4)');
    
    statusCells.forEach(cell => {
        const status = cell.textContent.trim();
        let badgeClass = '';
        
        if (status.toLowerCase().includes('pending')) {
            badgeClass = 'status-pending';
        } else if (status.toLowerCase().includes('progress')) {
            badgeClass = 'status-progress';
        } else if (status.toLowerCase().includes('complete')) {
            badgeClass = 'status-complete';
        }
        
        if (badgeClass) {
            cell.innerHTML = `<span class="status-badge ${badgeClass}">${status}</span>`;
        }
    });
}

function addButtonEffects() {
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        // Add ripple effect class
        button.classList.add('btn-ripple');
        
        // Add event listener for ripple
        button.addEventListener('click', function(e) {
            const x = e.clientX - this.getBoundingClientRect().left;
            const y = e.clientY - this.getBoundingClientRect().top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

function animateRows() {
    // Animation is handled by CSS, but we could add custom animations here
    // For example, we could add a fade-in effect when the page loads
    
    // Add hover animation effects for rows
    const rows = document.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        // Add hover animation to cells within the row
        row.addEventListener('mouseenter', () => {
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, index) => {
                cell.style.transitionDelay = `${index * 0.03}s`;
                cell.style.opacity = '0.85';
                cell.style.transform = 'scale(1.01)';
            });
        });
        
        row.addEventListener('mouseleave', () => {
            const cells = row.querySelectorAll('td');
            cells.forEach(cell => {
                cell.style.transitionDelay = '0s';
                cell.style.opacity = '1';
                cell.style.transform = 'scale(1)';
            });
        });
    });
}

// Add form submission animation
document.addEventListener('submit', function(e) {
    const form = e.target;
    const button = form.querySelector('button');
    
    if (button) {
        button.innerHTML = '<span class="spinner"></span>';
        button.disabled = true;
        
        // Add spinner style
        const style = document.createElement('style');
        style.textContent = `
            .spinner {
                display: inline-block;
                width: 15px;
                height: 15px;
                border: 2px solid rgba(255,255,255,0.3);
                border-radius: 50%;
                border-top-color: #fff;
                animation: spin 0.8s linear infinite;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
});

// Add page refresh animation
window.addEventListener('pageshow', function(e) {
    if (e.persisted) {
        // Page was loaded from cache (back button)
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.opacity = '1';
            document.body.style.transition = 'opacity 0.3s ease';
        }, 10);
    }
});