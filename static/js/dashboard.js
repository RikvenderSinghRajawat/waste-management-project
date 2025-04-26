/**
 * BABA Waste Management Dashboard JavaScript
 * This script handles all interactive elements and functionality for the user dashboard
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize core dashboard functionality
    initializeDashboard();
});

/**
 * Main initialization function for dashboard
 */
function initializeDashboard() {
    // Initialize UI components
    initializeLoader();
    initializeSidebar();
    initializeThemeToggle();
    initializeEcoTips();
    initializeSearchFilter();
    initializeFilterButtons();
    initializeComplaintDetails();
    initializeStatusUpdate();
    initializeAnimations();
    
    // Show welcome toast when dashboard loads
    setTimeout(() => {
        showToast('Welcome to BABA Waste Management Dashboard', 'success');
    }, 2000);
}

/**
 * Handle page loader animation
 */
function initializeLoader() {
    const loader = document.getElementById('loader');
    const dashboard = document.getElementById('dashboard-container');
    
    if (loader && dashboard) {
        // Simulate loading process
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                dashboard.style.display = 'flex';
                document.body.classList.add('loaded');
                animateStats();
            }, 500);
        }, 1500);
    }
}

/**
 * Handle sidebar toggle and responsiveness
 */
function initializeSidebar() {
    const toggleSidebarBtn = document.getElementById('toggle-sidebar');
    const sidebar = document.getElementById('sidebar');
    
    if (toggleSidebarBtn && sidebar) {
        // Toggle sidebar when button is clicked
        toggleSidebarBtn.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            // Save preference in localStorage
            localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
        });
        
        // Check if sidebar state is saved in localStorage
        const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (sidebarCollapsed) {
            sidebar.classList.add('collapsed');
        }
        
        // Handle responsive sidebar for mobile
        if (window.innerWidth <= 768) {
            sidebar.classList.add('collapsed');
            
            // Add toggle functionality for mobile
            toggleSidebarBtn.addEventListener('click', function() {
                sidebar.classList.toggle('show');
            });
            
            // Close sidebar when clicking outside on mobile
            document.addEventListener('click', function(event) {
                if (!sidebar.contains(event.target) && !toggleSidebarBtn.contains(event.target)) {
                    sidebar.classList.remove('show');
                }
            });
        }
        
        // Update sidebar on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth <= 768) {
                sidebar.classList.add('collapsed');
            } else {
                sidebar.classList.remove('show');
                // Restore user preference on larger screens
                if (localStorage.getItem('sidebarCollapsed') !== 'true') {
                    sidebar.classList.remove('collapsed');
                }
            }
        });
    }
}

/**
 * Handle theme toggle (light/dark mode)
 */
function initializeThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            
            // Update icon
            const themeIcon = themeToggleBtn.querySelector('i');
            if (document.body.classList.contains('dark-theme')) {
                themeIcon.className = 'fas fa-sun';
                localStorage.setItem('theme', 'dark');
            } else {
                themeIcon.className = 'fas fa-moon';
                localStorage.setItem('theme', 'light');
            }
        });
        
        // Check saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggleBtn.querySelector('i').className = 'fas fa-sun';
        }
        
        // Check system preference if no saved preference
        if (!savedTheme) {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.body.classList.add('dark-theme');
                themeToggleBtn.querySelector('i').className = 'fas fa-sun';
                localStorage.setItem('theme', 'dark');
            }
        }
    }
}

/**
 * Handle Eco Tips panel and tips cycling functionality
 */
function initializeEcoTips() {
    const ecoTipsBtn = document.getElementById('eco-tips');
    const ecoTipsPanel = document.getElementById('eco-tips-panel');
    const closeTipsBtn = document.getElementById('close-tips');
    const nextTipBtn = document.getElementById('next-tip');
    const currentTip = document.getElementById('current-tip');
    
    // Array of eco tips
    const ecoTips = [
        "Separate your waste into recyclables, compostables, and non-recyclables to maximize resource recovery.",
        "Reduce food waste by planning meals, storing food properly, and composting scraps.",
        "Choose products with minimal packaging or packaging made from recycled materials.",
        "Fix leaky faucets and pipes to conserve water and prevent water damage.",
        "Use reusable bags, bottles, and containers to reduce single-use plastics.",
        "Donate usable items instead of throwing them away to extend their lifecycle.",
        "Properly dispose of hazardous waste like batteries, electronics, and chemicals at designated collection centers.",
        "Start a compost bin for food scraps and yard waste to create nutrient-rich soil for gardening.",
        "Turn off lights and unplug electronics when not in use to save energy.",
        "Support local recycling programs and environmental initiatives in your community."
    ];
    
    let currentTipIndex = 0;
    
    if (ecoTipsBtn && ecoTipsPanel && closeTipsBtn && nextTipBtn) {
        // Show/hide tips panel
        ecoTipsBtn.addEventListener('click', function() {
            ecoTipsPanel.classList.add('show');
        });
        
        closeTipsBtn.addEventListener('click', function() {
            ecoTipsPanel.classList.remove('show');
        });
        
        // Next tip functionality
        nextTipBtn.addEventListener('click', function() {
            currentTipIndex = (currentTipIndex + 1) % ecoTips.length;
            updateTip();
        });
        
        // Update displayed tip with animation
        function updateTip() {
            currentTip.style.opacity = '0';
            
            setTimeout(() => {
                const tipElement = currentTip.querySelector('p');
                tipElement.textContent = ecoTips[currentTipIndex];
                currentTip.style.opacity = '1';
            }, 300);
        }
    }
}

/**
 * Handle search functionality for complaints
 */
function initializeSearchFilter() {
    const searchInput = document.getElementById('search-input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterComplaints(searchTerm);
        });
    }
    
    // Filter complaints based on search term
    function filterComplaints(searchTerm) {
        const allComplaints = document.querySelectorAll('#all-complaints-list .complaint-row');
        const myComplaints = document.querySelectorAll('#my-complaints-list .complaint-row');
        const noComplaintsRow = document.getElementById('no-complaints-row');
        
        let hasVisibleComplaints = false;
        
        // Filter all complaints
        allComplaints.forEach(row => {
            const complaintText = row.children[1].textContent.toLowerCase();
            const username = row.children[0].textContent.toLowerCase();
            
            if (complaintText.includes(searchTerm) || username.includes(searchTerm)) {
                row.style.display = '';
                hasVisibleComplaints = true;
            } else {
                row.style.display = 'none';
            }
        });
        
        // Show "no results" message if needed
        if (noComplaintsRow) {
            if (hasVisibleComplaints) {
                noComplaintsRow.style.display = 'none';
            } else {
                noComplaintsRow.style.display = '';
            }
        }
        
        // Filter my complaints
        myComplaints.forEach(row => {
            const complaintText = row.children[0].textContent.toLowerCase();
            
            if (complaintText.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
}

/**
 * Handle filter buttons for complaint status
 */
function initializeFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter complaints by status
                const filter = this.getAttribute('data-filter');
                filterComplaintsByStatus(filter);
            });
        });
    }
    
    // Filter complaints based on selected status
    function filterComplaintsByStatus(status) {
        const allComplaints = document.querySelectorAll('#all-complaints-list .complaint-row');
        const noComplaintsRow = document.getElementById('no-complaints-row');
        
        let hasVisibleComplaints = false;
        
        allComplaints.forEach(row => {
            if (status === 'all' || row.getAttribute('data-status') === status) {
                row.style.display = '';
                hasVisibleComplaints = true;
            } else {
                row.style.display = 'none';
            }
        });
        
        // Show "no results" message if needed
        if (noComplaintsRow) {
            if (hasVisibleComplaints) {
                noComplaintsRow.style.display = 'none';
            } else {
                noComplaintsRow.style.display = '';
            }
        }
    }
}

/**
 * Handle complaint details modal functionality
 */
function initializeComplaintDetails() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const modal = document.getElementById('complaint-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    
    if (viewButtons.length > 0 && modal && closeModalBtn) {
        // Open modal when view button is clicked
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const complaintId = this.getAttribute('data-id');
                openComplaintModal(complaintId);
            });
        });
        
        // Close modal
        closeModalBtn.addEventListener('click', closeModal);
        
        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && modal.classList.contains('show')) {
                closeModal();
            }
        });
    }
    
    // Open complaint details modal
    function openComplaintModal(complaintId) {
        // In a real application, this would fetch complaint details from the server
        // Here we'll simulate it by using the data from the table
        
        const complaintRow = document.querySelector(`.view-btn[data-id="${complaintId}"]`).closest('tr');
        const tableId = complaintRow.closest('tbody').id;
        
        let username, complaintText, status;
        
        if (tableId === 'all-complaints-list') {
            username = complaintRow.children[0].textContent;
            complaintText = complaintRow.children[1].textContent;
            status = complaintRow.children[2].querySelector('.status-badge').textContent;
        } else {
            username = document.querySelector('.user-name').textContent; // Current user
            complaintText = complaintRow.children[0].textContent;
            status = complaintRow.children[1].querySelector('.status-badge').textContent;
        }
        
        // Update modal content
        document.getElementById('modal-user').textContent = username;
        document.getElementById('modal-status').textContent = status;
        document.getElementById('modal-complaint').textContent = complaintText;
        
        // For admin status updates
        const complaintIdInput = document.getElementById('complaint-id');
        const statusSelect = document.getElementById('status-select');
        
        if (complaintIdInput) {
            complaintIdInput.value = complaintId;
        }
        
        if (statusSelect) {
            // Set current status in dropdown
            for (let i = 0; i < statusSelect.options.length; i++) {
                if (statusSelect.options[i].text === status) {
                    statusSelect.selectedIndex = i;
                    break;
                }
            }
        }
        
        // Show modal with animation
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }
    
    // Close complaint modal
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

/**
 * Handle status updates for complaints (admin functionality)
 */
function initializeStatusUpdate() {
    const updateForm = document.getElementById('update-status-form');
    
    if (updateForm) {
        updateForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const complaintId = document.getElementById('complaint-id').value;
            const newStatus = document.getElementById('status-select').value;
            
            // Update complaint status (simulated)
            updateComplaintStatus(complaintId, newStatus);
        });
    }
    
    // Update complaint status in UI and simulate server update
    function updateComplaintStatus(complaintId, newStatus) {
        // Find all instances of this complaint in tables
        const viewButtons = document.querySelectorAll(`.view-btn[data-id="${complaintId}"]`);
        
        viewButtons.forEach(button => {
            const row = button.closest('tr');
            const statusCell = row.querySelector('.status-badge');
            
            if (statusCell) {
                // Remove old status classes
                statusCell.classList.remove('pending', 'progress', 'complete');
                
                // Add new status class
                let statusClass = '';
                if (newStatus === 'Pending') statusClass = 'pending';
                else if (newStatus === 'In Progress') statusClass = 'progress';
                else if (newStatus === 'Complete') statusClass = 'complete';
                
                statusCell.classList.add(statusClass);
                statusCell.textContent = newStatus;
                
                // Update row data attribute
                row.setAttribute('data-status', newStatus.toLowerCase());
            }
        });
        
        // Close modal
        const modal = document.getElementById('complaint-modal');
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        
        // Show success toast
        showToast('Complaint status successfully updated', 'success');
    }
}

/**
 * Handle animations for stats counters
 */
function animateStats() {
    const statElements = document.querySelectorAll('.stat-count');
    
    statElements.forEach(element => {
        const targetValue = parseInt(element.getAttribute('data-count'), 10);
        animateCounter(element, 0, targetValue, 1500);
    });
    
    // Animate counter from start to end value
    function animateCounter(element, start, end, duration) {
        const range = end - start;
        const increment = end > start ? 1 : -1;
        const stepTime = Math.abs(Math.floor(duration / range));
        const isEcoImpact = element.id === 'eco-impact';
        
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (isEcoImpact) {
                element.textContent = `${current} kg CO₂`;
            } else {
                element.textContent = current;
            }
            
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                if (isEcoImpact) {
                    element.textContent = `${end} kg CO₂`;
                } else {
                    element.textContent = end;
                }
                clearInterval(timer);
            }
        }, stepTime);
    }
}

/**
 * Initialize additional animations and interactions
 */
function initializeAnimations() {
    // Add hover animations to action cards
    const actionCards = document.querySelectorAll('.action-card');
    
    actionCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.action-icon').classList.add('pulse');
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('.action-icon').classList.remove('pulse');
        });
    });
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of toast (success, warning, error)
 */
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    
    if (!toastContainer) return;
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Icon based on type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    if (type === 'error') icon = 'times-circle';
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-${icon}"></i>
        </div>
        <div class="toast-message">${message}</div>
        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Add close functionality
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', function() {
        toast.style.opacity = '0';
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300);
    });
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (toast.parentNode === toastContainer) {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast.parentNode === toastContainer) {
                    toastContainer.removeChild(toast);
                }
            }, 300);
        }
    }, 3000);
}

/**
 * Handle form submissions for waste collection (simulation)
 * This would be connected to server endpoints in a real application
 */
function handleWasteCollectionForm() {
    const wasteForm = document.getElementById('waste-collection-form');
    
    if (wasteForm) {
        wasteForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Simulate form submission
            showToast('Waste collection scheduled successfully!', 'success');
            
            // Reset form
            this.reset();
            
            // Update stats (simulation)
            const collectionsCount = document.getElementById('my-collections-count');
            if (collectionsCount) {
                const currentCount = parseInt(collectionsCount.textContent, 10);
                collectionsCount.setAttribute('data-count', currentCount + 1);
                collectionsCount.textContent = currentCount + 1;
            }
            
            // Update eco impact (simulation)
            const ecoImpact = document.getElementById('eco-impact');
            if (ecoImpact) {
                const currentImpact = parseInt(ecoImpact.textContent, 10);
                const newImpact = currentImpact + Math.floor(Math.random() * 10) + 5;
                ecoImpact.setAttribute('data-count', newImpact);
                ecoImpact.textContent = `${newImpact} kg CO₂`;
            }
        });
    }
}

/**
 * Handle complaint form submissions (simulation)
 * This would be connected to server endpoints in a real application
 */
function handleComplaintForm() {
    const complaintForm = document.getElementById('complaint-form');
    
    if (complaintForm) {
        complaintForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Simulate form submission
            showToast('Your complaint has been submitted successfully!', 'success');
            
            // Reset form
            this.reset();
            
            // Update complaint count (simulation)
            const complaintsCount = document.getElementById('my-complaints-count');
            if (complaintsCount) {
                const currentCount = parseInt(complaintsCount.textContent, 10);
                complaintsCount.setAttribute('data-count', currentCount + 1);
                complaintsCount.textContent = currentCount + 1;
            }
        });
    }
}