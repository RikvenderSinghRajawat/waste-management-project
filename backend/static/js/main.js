// Function to validate forms before submission
function validateForm() {
    const inputs = document.querySelectorAll('input, textarea');
    let valid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = 'red';
            valid = false;
        } else {
            input.style.borderColor = '#ddd';
        }
    });

    return valid;
}

// Add event listener to form submission for validation
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(event) {
        if (!validateForm()) {
            event.preventDefault();  // Prevent form submission if validation fails
            alert('Please fill in all fields.');
        }
    });
});
