// Add interactivity to the camplain table
document.addEventListener("DOMContentLoaded", function() {
    const table = document.querySelector(".my-camplain-table");
    const rows = table.rows;

    // Add event listener to each row for highlighting
    for (let i = 1; i < rows.length; i++) { // Start from 1 to skip the header
        rows[i].addEventListener("click", function() {
            // Toggle row highlighting on click
            this.classList.toggle("highlighted");
        });
    }
});