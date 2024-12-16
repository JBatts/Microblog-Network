document.addEventListener("DOMContentLoaded", () => {
    getLoginStatus()
    const logOutButton = document.getElementById("logOut");

    // Event listener for the "Log-Out" button
    logOutButton.addEventListener("click", async () => {
        // Optional: Call the logout API endpoint (if necessary)
        const result = await logOut();
        console.log(result);  // You can log the result if you want to check the server's response

        // Remove token and username from localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("username");

        // Redirect to the login page
        alert("You have been logged out.");
        window.location.href = "login.html";
    });
});