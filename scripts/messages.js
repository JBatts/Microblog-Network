function getMessage(m) {
    return `
    <div data-post_id="${m._id}" class="message">
    <div id="userInfo" style="display: none; border: 1px solid #ccc; padding: 10px; margin: 10px;"></div>
        From: ${m.username} 
        <button class="viewProfileBtn" data-username="${m.username}">View Profile</button><br>
        When: ${timeAgo(m.createdAt)}<br>
        Text: ${m.text}<br>
        Likes: <span class="like-count">${m.likes.length}</span><br>
        <button class="likeBtn" data-post_id="${m._id}">Like</button>
    </div>
    `;
}


document.addEventListener("DOMContentLoaded", async () => {
    getLoginStatus();
    const messages = await getMessageList();
    const output = document.getElementById('output');  // Ensure output is correctly declared
    output.innerHTML = messages.map(getMessage).join("<hr>");

    // Like buttons 
    const likeButtons = document.querySelectorAll('.likeBtn');
    likeButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const postId = event.target.dataset.post_id;  // Get the post ID from the clicked button
            await toggleLikes(postId);  // Call the addLikes function to handle the like
            window.location.reload();
        });
    });

    // View profile buttons
    const viewProfileButtons = document.querySelectorAll('.viewProfileBtn');
    viewProfileButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const username = event.target.dataset.username;
            await getUserInfo(username); // Fetch and display user info
        });
    });
});


