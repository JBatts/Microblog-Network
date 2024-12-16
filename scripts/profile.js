document.addEventListener("DOMContentLoaded", () => {
    getLoginStatus();
    const logOutButton = document.getElementById("logOut");
    logOutButton.addEventListener("click", async () => {
        // Remove token and username from localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("username");

        // Redirect to the login page
        alert("You have been logged out.");
        window.location.href = "login.html";
    });
});