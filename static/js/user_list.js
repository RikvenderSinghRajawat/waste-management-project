document.addEventListener("DOMContentLoaded", () => {
    const makeAdminButtons = document.querySelectorAll("button[name='action'][value='make_admin']");
    const deleteUserButtons = document.querySelectorAll("button[name='action'][value='delete_user']");

    makeAdminButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            if (!confirmAction("Are you sure you want to make this user an admin?")) {
                e.preventDefault();
            }
        });
    });

    deleteUserButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            if (!confirmAction("Are you sure you want to delete this user?")) {
                e.preventDefault();
            }
        });
    });
});
