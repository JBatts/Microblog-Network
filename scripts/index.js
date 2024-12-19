document.addEventListener("DOMContentLoaded", async () => {
    // Fetch the latest posts and display them
    const posts = await getMessageList();

    // Display the first 3 posts
    const postsContainer = document.getElementById("postsContainer");

    // Map each post to a new HTML structure for the card layout
    posts.sort((a, b) => b.likes.length - a.likes.length).slice(0, 3).forEach(post => {
        const postElement = document.createElement("div");
        // postElement.classList.add("col-md-6", "mb-4"); // Ensure it's in a grid

        // Set up the post card structure
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

        // Add the post element to the container
        postsContainer.appendChild(postElement);
    });

    

    // Add event listener for Like button functionality
    const likeButtons = document.querySelectorAll('.likeBtn');
    likeButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const postId = button.dataset.post_id;
            await toggleLikes(postId, button);
        });
    });
    
});
