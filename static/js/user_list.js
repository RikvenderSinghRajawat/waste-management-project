// static/js/user_list.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initTableAnimations();
    
    // Make table sortable
    initSortableTable();
    
    // Initialize search functionality
    initSearchFunction();
    
    // Add button animations
    initButtonAnimations();
});

function initTableAnimations() {
    // Add animation class to table for initial load effect
    const table = document.querySelector('table');
    table.classList.add('animated');
    
    // Add staggered animation for table rows
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach((row, index) => {
        // We're using CSS for animation delays, but we could add them here too
        row.style.animationDelay = `${index * 0.1}s`;
    });
}

function initSortableTable() {
    const table = document.querySelector('table');
    const headers = table.querySelectorAll('th[data-sort]');
    const tbody = table.querySelector('tbody');
    
    headers.forEach(header => {
        header.addEventListener('click', function() {
            // Remove sorting classes from all headers
            headers.forEach(h => {
                h.classList.remove('asc', 'desc');
            });
            
            // Get current sort state
            const sortDirection = this.classList.contains('asc') ? 'desc' : 'asc';
            
            // Update classes for current header
            this.classList.remove('asc', 'desc');
            this.classList.add(sortDirection);
            
            // Get column index and sort type
            const columnName = this.getAttribute('data-sort');
            const columnIndex = Array.from(this.parentNode.children).indexOf(this);
            
            // Sort the table
            sortTable(tbody, columnIndex, sortDirection);
        });
    });
}

function sortTable(tbody, columnIndex, direction) {
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // Add animation class for sorting
    rows.forEach(row => {
        row.classList.add('sorting');
    });
    
    // Sort rows
    rows.sort((a, b) => {
        const aValue = a.children[columnIndex].textContent.trim();
        const bValue = b.children[columnIndex].textContent.trim();
        
        // Check if values are numbers
        const aNum = parseFloat(aValue);
        const bNum = parseFloat(bValue);
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return direction === 'asc' ? aNum - bNum : bNum - aNum;
        }
        
        // Otherwise, sort as strings
        return direction === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
    });
    
    // Apply animation and reorder
    rows.forEach((row, index) => {
        // Remove row from DOM
        row.remove();
        
        // Add back with animation delay
        setTimeout(() => {
            tbody.appendChild(row);
            
            // Remove sorting class after animation
            setTimeout(() => {
                row.classList.remove('sorting');
            }, 50);
        }, index * 50);
    });
}

function initSearchFunction() {
    const searchInput = document.getElementById('searchInput');
    const tableRows = document.querySelectorAll('tbody tr');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        tableRows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const match = text.includes(searchTerm);
            
            // Apply animation for filtering
            if (match) {
                row.style.display = '';
                row.classList.remove('filtered-out');
                row.classList.add('filtered-in');
            } else {
                row.classList.add('filtered-out');
                row.classList.remove('filtered-in');
                // Wait for animation to complete before hiding
                setTimeout(() => {
                    if (row.classList.contains('filtered-out')) {
                        row.style.display = 'none';
                    }
                }, 300);
            }
        });
    });
    
    // Add styles for filter animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes filterIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes filterOut {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(20px); }
        }
        
        .filtered-in {
            animation: filterIn 0.3s forwards;
        }
        
        .filtered-out {
            animation: filterOut 0.3s forwards;
        }
        
        .sorting {
            opacity: 0.5;
            transform: scale(0.98);
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

function initButtonAnimations() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        // Add ripple effect
        button.addEventListener('mousedown', function(e) {
            const x = e.clientX - this.getBoundingClientRect().left;
            const y = e.clientY - this.getBoundingClientRect().top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add styles for ripple
    const style = document.createElement('style');
    style.textContent = `
        .ripple-effect {
            position: absolute;
            background: rgba(255, 255, 255, 0.7);
            border-radius: 50%;
            width: 100px;
            height: 100px;
            margin-top: -50px;
            margin-left: -50px;
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            0% {
                transform: scale(0);
                opacity: 0.5;
            }
            100% {
                transform: scale(3);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Add hover state animations
document.addEventListener('mouseover', function(e) {
    if (e.target.tagName === 'TD') {
        const row = e.target.parentNode;
        const cells = row.querySelectorAll('td');
        
        cells.forEach((cell, index) => {
            cell.style.transitionDelay = `${index * 0.03}s`;
        });
    }
});

// Add page load animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Add a style for loaded animation
    const style = document.createElement('style');
    style.textContent = `
        .loaded {
            animation: fullPageLoaded 0.5s ease;
        }
        
        @keyframes fullPageLoaded {
            from { opacity: 0.8; transform: scale(0.98); }
            to { opacity: 1; transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
});