// DOM Elements
const loader = document.querySelector('.loader');
const toggleSidebarBtn = document.getElementById('toggle-sidebar');
const sidebar = document.querySelector('.sidebar');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const complaintsCountEl = document.getElementById('complaints-count');
const usersCountEl = document.getElementById('users-count');
const wasteCountEl = document.getElementById('waste-count');
const resolvedCountEl = document.getElementById('resolved-count');
const searchInput = document.getElementById('search-input');
const profilePic = document.getElementById('profile-pic');

// Hide loader when page is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Hide loader after a short delay
  setTimeout(() => {
    if (loader) {
      loader.classList.add('hidden');
    }
  }, 800);
});

// Toggle sidebar
if (toggleSidebarBtn) {
  toggleSidebarBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    
    // If on mobile, add/remove active class
    if (window.innerWidth < 992) {
      sidebar.classList.toggle('active');
    }
  });
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
  if (window.innerWidth < 992 && 
      sidebar && sidebar.classList.contains('active') && 
      !sidebar.contains(e.target) && 
      e.target !== toggleSidebarBtn) {
    sidebar.classList.remove('active');
  }
});

// Theme toggle functionality
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const body = document.body;
    body.classList.toggle('dark-theme');
    
    // Toggle icon between moon and sun
    if (body.classList.contains('dark-theme')) {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
      localStorage.setItem('theme', 'dark');
    } else {
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
      localStorage.setItem('theme', 'light');
    }
  });
}

// Check for saved theme preference
function loadThemePreference() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    if (themeIcon) {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    }
  }
}

// Search functionality
if (searchInput) {
  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const tableRows = document.querySelectorAll('.complaints-table tbody tr');
    
    tableRows.forEach(row => {
      const text = row.textContent.toLowerCase();
      if (text.includes(searchTerm)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });
}

// Handle action buttons
const actionIcons = document.querySelectorAll('.action-icon');
actionIcons.forEach(icon => {
  icon.addEventListener('click', function() {
    const action = this.classList.contains('view') ? 'view' : 
                  this.classList.contains('edit') ? 'edit' : 'delete';
    const row = this.closest('tr');
    const complaintId = row.dataset.id || 'unknown'; // Assuming you'll add data-id attribute to rows
    
    switch(action) {
      case 'view':
        viewComplaint(complaintId);
        break;
      case 'edit':
        editComplaint(complaintId);
        break;
      case 'delete':
        confirmDelete(complaintId, row);
        break;
    }
  });
});

// Action functions (placeholders - implement with your backend)
function viewComplaint(id) {
  console.log(`Viewing complaint ID: ${id}`);
  // Redirect to detail page or show modal
  // window.location.href = `/complaint/view/${id}`;
  // Or show in modal
  alert(`View complaint ${id} details`);
}

function editComplaint(id) {
  console.log(`Editing complaint ID: ${id}`);
  // Redirect to edit page or show edit modal
  // window.location.href = `/complaint/edit/${id}`;
  alert(`Edit complaint ${id}`);
}

function confirmDelete(id, rowElement) {
  const confirmation = confirm("Are you sure you want to delete this complaint?");
  if (confirmation) {
    console.log(`Deleting complaint ID: ${id}`);
    // Send delete request to backend
    // After successful deletion:
    rowElement.style.opacity = '0';
    setTimeout(() => {
      rowElement.remove();
    }, 300);
  }
}

// Handle window resize
window.addEventListener('resize', () => {
  if (window.innerWidth >= 992 && sidebar) {
    sidebar.classList.remove('active');
  }
});

// Initialize theme and other settings
function init() {
  loadThemePreference();
  
  // Handle broken profile image
  if (profilePic) {
    profilePic.onerror = function() {
      this.onerror = null;
      this.src = '/static/profile_pics/default.jpeg';
    };
  }
}

// Run initialization
init();