document.getElementById("profile_pic").addEventListener("change", function () {
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    if (!allowedExtensions.exec(this.value)) {
        alert("Invalid file type. Please upload an image file.");
        this.value = "";
    }
});
