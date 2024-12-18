async function getMessage(m) {
    // Fetch user info for the post
    const response = await fetch(BASE_URL + `/api/users/${m.username}`, {
        method: "GET",
        headers: headersWithAuth(),
    });

    let userInfo = {};
    if (response.status === 200) {
        userInfo = await response.json();
    } else {
        userInfo = { fullName: "Unknown", bio: "No bio available" };
    }

    // Generate the Gravatar URL using the user's email
    const gravatarUrl = getGravatarUrl(m.username, 100); // Pass user email  
    
    return `
        <div class="col-md-6 mb-4">
            <div data-post_id="${m._id}" class="card">
                <img src="${gravatarUrl}" alt="Profile Picture" class="card-img-top gravatar">
                <div class="card-body">
                    <h5 class="card-title">${userInfo.fullName} <br>(${m.username})</h5>
                    <p class="card-text">${userInfo.bio}</p>
                    <p class="card-text">When: ${timeAgo(m.createdAt)}</p>
                    <p class="card-text">Text: ${m.text}</p>
                    <p class="card-text">Likes: <span class="like-count">${m.likes.length}</span></p>
                    <button class="likeBtn btn btn-outline-primary" data-post_id="${m._id}">
                        <img src="${m.likes.some(like => like.username === localStorage.username) 
                           ?  './img/heart.png'
                           : './img/emptyHeart.png'}" alt="heart">
                    </button>
                </div>
            </div>
        </div>
    `;
}




document.addEventListener("DOMContentLoaded", async () => {
    getLoginStatus();
    const messages = await getMessageList();
    const output = document.getElementById('output');
    // Map posts to include user profile info
    const postHTMLPromises = messages.map(getMessage);
    const postHTMLArray = await Promise.all(postHTMLPromises);
    output.innerHTML = `
    <div class="container">
        <div class="row">
            ${postHTMLArray.join("")}
        </div>
    </div>
`;
    
async function renderMessages() {
    const postHTMLPromises = messages.map(getMessage);
    const postHTMLArray = await Promise.all(postHTMLPromises);

    const output = document.getElementById('output');
    
    // Wrap the posts in a Bootstrap container and row to create a proper grid
    output.innerHTML = `
        <div class="container">
            <div class="row">
                ${postHTMLArray.join("")}
            </div>
        </div>
    `;
    
    // Like buttons 
    const likeButtons = document.querySelectorAll('.likeBtn');
    likeButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const postId = button.dataset.post_id;  // Get the post ID from the clicked button
            await toggleLikes(postId);  // Call the addLikes function to handle the like
            window.location.reload();
        });
    });
};
    sortMessages.addEventListener("change", () => {
        const sortValue = sortMessages.value;
        if (sortValue === "time") {
            messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Newest first
        } else if (sortValue === "timeAsc") {
            messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // Oldest first
        } else if (sortValue === "username") {
            messages.sort((a, b) => a.username.localeCompare(b.username)); // A-Z
        } else if (sortValue === "usernameDesc") {
            messages.sort((a, b) => b.username.localeCompare(a.username)); // Z-A
        }
        renderMessages();
    });
    renderMessages(); 
});


