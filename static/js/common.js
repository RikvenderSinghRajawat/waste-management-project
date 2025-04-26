// Common utility functions
function confirmAction(message) {
    return confirm(message);
}

function showLoader() {
    const loader = document.createElement("div");
    loader.classList.add("loader");
    loader.innerHTML = `<div class="spinner"></div>`;
    document.body.appendChild(loader);
}

function hideLoader() {
    const loader = document.querySelector(".loader");
    if (loader) loader.remove();
}

window.addEventListener("DOMContentLoaded", () => {
    const alerts = document.querySelectorAll(".alert");
    alerts.forEach(alert => {
        setTimeout(() => alert.remove(), 3000); // Auto-remove alerts after 3 seconds
    });
});
