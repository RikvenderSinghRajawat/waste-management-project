document.addEventListener("DOMContentLoaded", () => {
    const profilePic = document.querySelector(".profile-pic img");
    const sidebar = document.querySelector(".sidebar ul");

    // Toggle sidebar visibility when the profile picture is clicked
    profilePic.addEventListener("click", () => {
        sidebar.classList.toggle("visible");
    });
});
