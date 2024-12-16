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

    // Return the post with user info included
    return `
    <div data-post_id="${m._id}" class="message">
        <div class="user-profile">
            <strong>${userInfo.fullName}</strong> (${m.username})<br>
            <em>${userInfo.bio}</em>
        </div>
        <div class="post-content">
            When: ${timeAgo(m.createdAt)}<br>
            Text: ${m.text}<br>
            Likes: <span class="like-count">${m.likes.length}</span><br>
            <button class="likeBtn" data-post_id="${m._id}">Like</button>
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
    output.innerHTML = postHTMLArray.join("<hr>");

    // Like buttons 
    const likeButtons = document.querySelectorAll('.likeBtn');
    likeButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const postId = event.target.dataset.post_id;  // Get the post ID from the clicked button
            await toggleLikes(postId);  // Call the addLikes function to handle the like
            window.location.reload();
        });
    });
});


