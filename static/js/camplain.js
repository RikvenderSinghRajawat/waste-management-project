document.addEventListener('DOMContentLoaded', function() {
    const submitBtn = document.getElementById('submitBtn');
    const complaintText = document.getElementById('complaintText');
    const statusMessage = document.getElementById('status-message');
    
    submitBtn.addEventListener('click', function() {
        // Validate that complaint text is not empty
        if (!complaintText.value.trim()) {
            showMessage('Please enter your complaint before submitting', 'error');
            return;
        }
        
        // Show loading state
        const originalButtonText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="loading"></span> Submitting...';
        submitBtn.disabled = true;
        
        // Simulate sending data to the database
        setTimeout(function() {
            // Create the data object to send
            const complaintData = {
                complaint: complaintText.value,
                timestamp: new Date().toISOString()
            };
            
            // This would be an actual database call in production
            // For example using fetch API:
            // fetch('your-server-endpoint', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(complaintData)
            // })
            // .then(response => response.json())
            // .then(data => {
            //     showMessage('Complaint submitted successfully!', 'success');
            //     complaintText.value = '';
            // })
            // .catch(error => {
            //     showMessage('Error submitting complaint. Please try again.', 'error');
            // })
            // .finally(() => {
            //     submitBtn.innerHTML = originalButtonText;
            //     submitBtn.disabled = false;
            // });
            
            // For demonstration, we'll log the data and show success
            console.log('Sending complaint data to database:', complaintData);
            
            // Show success message
            showMessage('Complaint submitted successfully!', 'success');
            
            // Reset form
            complaintText.value = '';
            
            // Reset button
            submitBtn.innerHTML = originalButtonText;
            submitBtn.disabled = false;
        }, 1500);
    });
    
    function showMessage(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = type;
        
        // Clear message after 5 seconds
        setTimeout(() => {
            statusMessage.textContent = '';
            statusMessage.className = '';
        }, 5000);
    }
    
    // Add animation when focusing on textarea
    complaintText.addEventListener('focus', function() {
        this.style.transform = 'scale(1.02)';
    });
    
    complaintText.addEventListener('blur', function() {
        this.style.transform = 'scale(1)';
    });
});