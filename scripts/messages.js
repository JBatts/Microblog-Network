document.addEventListener("DOMContentLoaded", async () => {
    getLoginStatus();
    // Define the container
    const output = document.getElementById("output");
    const sortMessages = document.getElementById("sortMessages"); // Adjust based on your HTML

    // Fetch posts
    let posts = await getMessageList();

    // Function to render posts
    const renderPosts = (posts) => {
        output.innerHTML = ""; // Clear existing posts
        posts.forEach(post => {
            const postElement = document.createElement("div");
            postElement.innerHTML = `
                <div data-post_id="${post._id}" class="card">
                    <img src="${getGravatarUrl(post.username, 100)}" alt="Profile Picture" class="card-img-top gravatar">
                    <div class="card-body">
                        <h5 class="card-title">${post.fullName} <br> (${post.username})</h5>
                        <p class="card-text"><strong>Bio: <br>${post.bio || "No bio available"}</strong></p><hr>
                        <p class="card-text"><strong>Posted ${timeAgo(post.createdAt)}</strong></p>
                        <p class="card-text mainText">${post.text}</p>
                        <p class="card-text"><strong>Likes: <span class="like-count">${post.likes.length}</span></strong></p>
                        <button class="likeBtn btn btn-outline-primary" data-post_id="${post._id}">
                            <img src="${post.likes.includes(localStorage.username) ? './img/heart.png' : './img/emptyHeart.png'}" alt="heart">
                        </button>
                    </div>
                </div>
            `;
            output.appendChild(postElement);
        });
        // Reattach Like button event listeners
        document.querySelectorAll('.likeBtn').forEach(button => {
            button.addEventListener('click', async () => {
                const postId = button.dataset.post_id;
                await toggleLikes(postId, button);
            });
        });
    };

    // Initial render
    renderPosts(posts);

    // Sorting functionality
    sortMessages.addEventListener("change", () => {
        const sortValue = sortMessages.value;

        if (sortValue === "time") {
            posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortValue === "timeAsc") {
            posts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        } else if (sortValue === "username") {
            posts.sort((a, b) => a.username.localeCompare(b.username));
        } else if (sortValue === "usernameDesc") {
            posts.sort((a, b) => b.username.localeCompare(a.username));
        } else if (sortValue === "lowLikes") {
            posts.sort((a, b) => a.likes.length - b.likes.length);
        } else if (sortValue === "mostLikes") {
            posts.sort((a, b) => b.likes.length - a.likes.length);
        }

        renderPosts(posts); // Re-render posts after sorting
    });
});
