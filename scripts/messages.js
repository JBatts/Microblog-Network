function getMessage(m) {
    return `
    <div data-post_id="${m._id}" class="message">
        From: ${m.username}<br>
        When: ${m.createdAt}<br>
        Text: ${m.text}<br>
        Likes: <span class="like-count">${m.likes.length}</span><br>
        <button class="likeBtn" data-post_id="${m._id}">Like</button>
    </div>
    `;
}

// Update the like count after a successful like
function updateLikeCount(message) {
    const messageElement = document.querySelector(`[data-post_id="${message._id}"]`);
    const likeCountElement = messageElement.querySelector('.like-count');
    likeCountElement.textContent = message.likes.length;  // Update the like count
};

document.addEventListener("DOMContentLoaded", async () => {
    getLoginStatus();
    const messages = await getMessageList();
    const output = document.getElementById('output');  // Ensure output is correctly declared
    output.innerHTML = messages.map(getMessage).join("<hr>");

    // Select all like buttons dynamically
    const likeButtons = document.querySelectorAll('.likeBtn');
    likeButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const postId = event.target.dataset.post_id;  // Get the post ID from the clicked button
            await addLikes(postId);  // Call the addLikes function to handle the like
            window.location.reload();
        });
    });
});


