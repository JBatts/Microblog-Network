// Display user profile information
function displayUserProfile(user) {
    greeting.textContent = `Hello, ${user.fullName || user.username}!`;
    profileInfo.innerHTML = `
        <p><strong>Username:</strong> ${user.username}</p>
        <p><strong>Full Name:</strong> ${user.fullName || "Not provided"}</p>
        <p><strong>Bio:</strong> ${user.bio || "No bio available."}</p>
        <p><strong>Joined:</strong> ${new Date(user.createdAt).toLocaleDateString()}</p>
    `;
};

// Display user's posts
function displayUserPosts(posts) {
    if (posts.length === 0) {
        postsContainer.innerHTML = "<p>You haven't posted anything yet!</p>";
    } else {
        postsContainer.innerHTML = posts.map(post => `
                <div class="post">
                    <p><strong>When:</strong> ${timeAgo(post.createdAt)}</p>
                    <p>${post.text}</p>
                    <p><strong>Likes:</strong> ${post.likes.length}</p>
                </div>
                <hr>
            `).join("");
    };
};

document.addEventListener("DOMContentLoaded", async () => {
    getLoginStatus();

    // Set up the logout button
    const logOutButton = document.getElementById("logOut");
    logOutButton.addEventListener("click", async () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        alert("You have been logged out.");
        window.location.href = "login.html";
    });

    // Fetch and display the user's profile
    const username = localStorage.username;
    const userProfile = await getUserProfile(username);
    if (userProfile) {
        displayUserProfile(userProfile);
        const userPosts = await getUserPosts(username);
        displayUserPosts(userPosts);
    };
});
