// Add some interactive functionality to the table
document.addEventListener("DOMContentLoaded", function() {
    const table = document.querySelector(".waste-trends-table");
    const rows = table.rows;

    // Add event listener to each row
    for (let i = 0; i < rows.length; i++) {
        rows[i].addEventListener("click", function() {
            // Toggle row highlighting on click
            this.classList.toggle("highlighted");
        });
    }
});