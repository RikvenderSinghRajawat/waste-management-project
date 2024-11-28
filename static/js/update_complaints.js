document.addEventListener("DOMContentLoaded", () => {
    const markCompleteButtons = document.querySelectorAll("button[name='action'][value='mark_complete']");
    const deleteButtons = document.querySelectorAll("button[name='action'][value='delete_complaint']");

    markCompleteButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            if (!confirmAction("Mark this complaint as complete?")) {
                e.preventDefault();
            }
        });
    });

    deleteButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            if (!confirmAction("Are you sure you want to delete this complaint?")) {
                e.preventDefault();
            }
        });
    });
});
