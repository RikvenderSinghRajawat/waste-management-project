// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initAnimations();
    
    // Add scroll event listener
    window.addEventListener('scroll', function() {
        animateOnScroll();
        parallaxEffect();
    });
    
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initialize tab functionality if tabs exist
    initTabs();
    
    // Initialize complaint preview functionality
    initComplaintPreview();
});

// Initialize basic animations
function initAnimations() {
    // Animate logo on load
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.style.opacity = '0';
        logo.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            logo.style.transition = 'all 0.8s ease';
            logo.style.opacity = '1';
            logo.style.transform = 'translateX(0)';
        }, 200);
    }
    
    // Animate auth buttons
    const authLinks = document.querySelectorAll('.auth-links a');
    authLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            link.style.transition = 'all 0.5s ease';
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, 400 + (index * 200));
    });
    
    // Animate action cards
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.8s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 600 + (index * 200));
    });
    
    // Set initial state for animated elements
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(30px)';
    });
}

// Animate elements when they come into view
function animateOnScroll() {
    // Animate steps
    animateElementsOnScroll('.step');
    
    // Animate FAQ items
    animateElementsOnScroll('.faq-item');
    
    // Animate recent complaints
    animateElementsOnScroll('.complaint-item');
}

// Generic function to animate elements on scroll
function animateElementsOnScroll(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element, index) => {
        const position = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (position < screenPosition) {
            setTimeout(() => {
                element.style.transition = 'all 0.8s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        }
    });
}

// Create a parallax effect on scroll
function parallaxEffect() {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrollPosition = window.pageYOffset;
        hero.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
    }
}

// Initialize tab functionality
function initTabs() {
    const tabLinks = document.querySelectorAll('.tab-link');
    if (tabLinks.length === 0) return;
    
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all tabs
            tabLinks.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all tab content
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Show the corresponding tab content
            const targetTab = this.getAttribute('data-tab');
            document.getElementById(targetTab).classList.add('active');
        });
    });
    
    // Set the first tab as active by default
    tabLinks[0].click();
}

// Initialize complaint preview functionality
function initComplaintPreview() {
    const complaintItems = document.querySelectorAll('.complaint-item');
    const previewContainer = document.querySelector('.complaint-preview');
    
    if (complaintItems.length === 0 || !previewContainer) return;
    
    complaintItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all complaint items
            complaintItems.forEach(complaint => complaint.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Update preview with data from selected complaint
            const complaintId = this.getAttribute('data-id');
            const title = this.querySelector('.complaint-title').textContent;
            const status = this.querySelector('.complaint-status').textContent;
            const date = this.querySelector('.complaint-date').textContent;
            const description = this.getAttribute('data-description');
            const location = this.getAttribute('data-location');
            
            previewContainer.querySelector('.preview-title').textContent = title;
            previewContainer.querySelector('.preview-status').textContent = status;
            previewContainer.querySelector('.preview-status').className = 'preview-status ' + status.toLowerCase().replace(' ', '-');
            previewContainer.querySelector('.preview-date').textContent = date;
            previewContainer.querySelector('.preview-description').textContent = description;
            previewContainer.querySelector('.preview-location').textContent = location;
            
            // Show the status timeline
            showStatusTimeline(status);
            
            // Show the preview container if it's hidden
            previewContainer.classList.add('active');
        });
    });
    
    // Click the first complaint item by default
    if (complaintItems.length > 0) {
        complaintItems[0].click();
    }
}

// Show status timeline based on current status
function showStatusTimeline(status) {
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length === 0) return;
    
    const statusMap = {
        'submitted': 1,
        'under review': 2,
        'in progress': 3,
        'resolved': 4,
        'closed': 5
    };
    
    const currentStep = statusMap[status.toLowerCase()] || 1;
    
    timelineItems.forEach((item, index) => {
        if (index < currentStep) {
            item.classList.add('completed');
        } else {
            item.classList.remove('completed');
        }
        
        if (index === currentStep - 1) {
            item.classList.add('current');
        } else {
            item.classList.remove('current');
        }
    });
}

// Form validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            
            // Show error message
            let errorMessage = field.getAttribute('data-error') || 'This field is required';
            let errorElement = field.nextElementSibling;
            
            if (!errorElement || !errorElement.classList.contains('error-message')) {
                errorElement = document.createElement('span');
                errorElement.classList.add('error-message');
                field.parentNode.insertBefore(errorElement, field.nextSibling);
            }
            
            errorElement.textContent = errorMessage;
        } else {
            field.classList.remove('error');
            
            // Remove error message if exists
            const errorElement = field.nextElementSibling;
            if (errorElement && errorElement.classList.contains('error-message')) {
                errorElement.remove();
            }
        }
    });
    
    return isValid;
}

// Initialize complaint form submission
function initComplaintForm() {
    const complaintForm = document.getElementById('complaint-form');
    if (!complaintForm) return;
    
    complaintForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm('complaint-form')) {
            // Show loading indicator
            const submitBtn = complaintForm.querySelector('[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Hide the form
                complaintForm.style.display = 'none';
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.classList.add('success-message');
                successMessage.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <h3>Complaint Submitted Successfully!</h3>
                    <p>Your complaint has been received. Tracking ID: <strong>WC-${Math.floor(Math.random() * 10000)}</strong></p>
                    <p>You can track the status of your complaint in your dashboard after logging in.</p>
                    <div class="btn-container">
                        <a href="{{ url_for('login') }}" class="btn primary-btn">Login to Track</a>
                        <button class="btn secondary-btn" id="submit-another">Submit Another Complaint</button>
                    </div>
                `;
                
                complaintForm.parentNode.appendChild(successMessage);
                
                // Add event listener to "Submit Another" button
                document.getElementById('submit-another').addEventListener('click', function() {
                    // Remove success message
                    successMessage.remove();
                    
                    // Reset and show form
                    complaintForm.reset();
                    complaintForm.style.display = 'block';
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                });
            }, 1500);
        }
    });
    
    // Initialize file upload preview
    const fileInput = complaintForm.querySelector('input[type="file"]');
    const previewContainer = document.createElement('div');
    previewContainer.classList.add('file-preview');
    
    if (fileInput) {
        fileInput.parentNode.insertBefore(previewContainer, fileInput.nextSibling);
        
        fileInput.addEventListener('change', function() {
            previewContainer.innerHTML = '';
            
            if (this.files && this.files.length > 0) {
                for (let i = 0; i < this.files.length; i++) {
                    const file = this.files[i];
                    const filePreview = document.createElement('div');
                    filePreview.classList.add('file-item');
                    
                    if (file.type.startsWith('image/')) {
                        const img = document.createElement('img');
                        img.src = URL.createObjectURL(file);
                        filePreview.appendChild(img);
                    } else {
                        const icon = document.createElement('i');
                        icon.classList.add('fas', 'fa-file');
                        filePreview.appendChild(icon);
                    }
                    
                    const fileName = document.createElement('span');
                    fileName.textContent = file.name;
                    filePreview.appendChild(fileName);
                    
                    previewContainer.appendChild(filePreview);
                }
            }
        });
    }
}

// Initialize waste trade form
function initTradeForm() {
    const tradeForm = document.getElementById('trade-form');
    if (!tradeForm) return;
    
    tradeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm('trade-form')) {
            // Show loading indicator
            const submitBtn = tradeForm.querySelector('[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Hide the form
                tradeForm.style.display = 'none';
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.classList.add('success-message');
                successMessage.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <h3>Waste Trade Listing Added Successfully!</h3>
                    <p>Your listing has been published. Listing ID: <strong>WT-${Math.floor(Math.random() * 10000)}</strong></p>
                    <p>You can manage your listings in your dashboard after logging in.</p>
                    <div class="btn-container">
                        <a href="{{ url_for('login') }}" class="btn primary-btn">Go to Dashboard</a>
                        <button class="btn secondary-btn" id="add-another">Add Another Listing</button>
                    </div>
                `;
                
                tradeForm.parentNode.appendChild(successMessage);
                
                // Add event listener to "Add Another" button
                document.getElementById('add-another').addEventListener('click', function() {
                    // Remove success message
                    successMessage.remove();
                    
                    // Reset and show form
                    tradeForm.reset();
                    tradeForm.style.display = 'block';
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                });
            }, 1500);
        }
    });
}

// Initialize FAQ accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length === 0) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(faq => faq.classList.remove('active'));
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Initialize waste type filter
function initWasteFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const wasteItems = document.querySelectorAll('.waste-item');
    
    if (filterButtons.length === 0 || wasteItems.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Show/hide waste items based on filter
            wasteItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-type') === filterValue) {
                    item.style.display = 'block';
                    
                    // Add animation
                    item.style.animation = 'fadeIn 0.5s forwards';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Set the first filter as active by default
    filterButtons[0].click();
}

// Initialize search functionality
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (!searchInput || !searchResults) return;
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        
        if (query.length > 2) {
            // Show loading indicator
            searchResults.innerHTML = '<div class="loading">Searching...</div>';
            searchResults.classList.add('active');
            
            // Simulate search (replace with actual API call)
            setTimeout(() => {
                // Sample results
                const results = [
                    { title: 'Waste collection schedule', type: 'page', url: '#' },
                    { title: 'How to report illegal dumping', type: 'faq', url: '#' },
                    { title: 'Recycling guidelines', type: 'document', url: '#' }
                ].filter(item => item.title.toLowerCase().includes(query));
                
                if (results.length > 0) {
                    searchResults.innerHTML = '';
                    
                    results.forEach(result => {
                        const resultItem = document.createElement('div');
                        resultItem.classList.add('search-result');
                        resultItem.innerHTML = `
                            <a href="${result.url}">
                                <div class="result-type">${result.type}</div>
                                <div class="result-title">${result.title}</div>
                            </a>
                        `;
                        searchResults.appendChild(resultItem);
                    });
                } else {
                    searchResults.innerHTML = '<div class="no-results">No results found</div>';
                }
            }, 500);
        } else {
            searchResults.classList.remove('active');
        }
    });
    
    // Close search results when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('active');
        }
    });
}

// Execute after page load
window.addEventListener('load', function() {
    // Initialize complaint form if exists
    initComplaintForm();
    
    // Initialize trade form if exists
    initTradeForm();
    
    // Initialize FAQ accordion
    initFAQ();
    
    // Initialize waste type filter
    initWasteFilter();
    
    // Initialize search functionality
    initSearch();
});