const BASE_URL = "http://microbloglite.us-east-2.elasticbeanstalk.com"
const NO_AUTH_HEADERS = { 'accept': 'application/json', 'Content-Type': 'application/json' };
// Insecure Token Free Actions (Only 2)

function getGravatarUrl(email, size = 100) {
    const hashedEmail = CryptoJS.SHA256(email.trim().toLowerCase()).toString(CryptoJS.enc.Hex);
    return `https://www.gravatar.com/avatar/${hashedEmail}?s=${size}`;
};


// Create user - sign up
async function signUp(username, fullName, password) {
    const payload = JSON.stringify(
        { "username": username, "fullName": fullName, "password": password }
    );
    const response = await fetch(BASE_URL + "/api/users", {
        method: "POST",
        headers: NO_AUTH_HEADERS,
        body: payload
    }); // end fetch

    // ToDo check for error response status codes
    if (response.status != 201) {
        console.log(response.status, response.statusText);
        return response.statusText;
    }
    const object = await response.json(); // Convert body to object
    return object;
};


// Login and store username and token received
async function login(username, password) {
    const payload = JSON.stringify({ "username": username, "password": password })
    const response = await fetch(BASE_URL + "/auth/login", {
        method: "POST",
        headers: NO_AUTH_HEADERS,
        body: payload
    }); // end fetch

    // ToDo check for error response status codes
    if (response.status != 200) {
        console.log(response.status, response.statusText);
        return response.statusText;
    }
    const object = await response.json(); // Convert body to object
    localStorage.token = object.token;
    localStorage.username = object.username;
    return object;
};

function getLoginStatus() {
    console.log("Current localStorage:", localStorage)
    if (!localStorage.token) {
        alert(`You must log in to access this page!`);
        window.location.href = "login.html";
        return;
    };
}

// Same as No Auth but with Auth Added
function headersWithAuth() {
    return {
        ...NO_AUTH_HEADERS,
        'Authorization': `Bearer ${localStorage.token}`,
    }
}

// Get secure list of messages using token
async function getMessageList() {
    const LIMIT_PER_PAGE = 1000;
    const OFFSET_PAGE = 0;
    const queryString = `?limit=${LIMIT_PER_PAGE}&offset=${OFFSET_PAGE}`;
    
    // Fetch posts
    const response = await fetch(BASE_URL + "/api/posts" + queryString, {
        method: "GET",
        headers: headersWithAuth(),
    });
    const posts = await response.json();

    // Fetch user information for each post
    const postsWithUserInfo = await Promise.all(posts.map(async (post) => {
        const userResponse = await fetch(BASE_URL + `/api/users/${post.username}`, {
            method: "GET",
            headers: headersWithAuth(),
        });
        
        const userInfo = await userResponse.json();
        post.fullName = userInfo.fullName || "Unknown";
        post.bio = userInfo.bio || "No bio available";
        
        return post;
    }));

    return postsWithUserInfo;
}


async function toggleLikes(postId, button) {
    const isLiked = button.querySelector('img').src.includes('heart.png');
    let response;

    if (isLiked) {
        // Unlike the post
        const messages = await getMessageList();
        const post = messages.find(p => p._id === postId);
        const likeId = post.likes.find(like => like.username === localStorage.username)._id;
        response = await fetch(BASE_URL + `/api/likes/${likeId}`, {
            method: "DELETE",
            headers: headersWithAuth(),
        });
    } else {
        // Like the post
        const payload = JSON.stringify({ postId });
        response = await fetch(BASE_URL + "/api/likes", {
            method: "POST",
            headers: headersWithAuth(),
            body: payload,
        });
    }

    if (response.ok) {
        // Update the like count and toggle button image
        const likeCountElement = button.parentElement.querySelector('.like-count');
        const currentLikes = parseInt(likeCountElement.textContent);
        likeCountElement.textContent = isLiked ? currentLikes - 1 : currentLikes + 1;

        button.querySelector('img').src = isLiked ? './img/emptyHeart.png' : './img/heart.png';
    }
}


async function createMessage(message) {
    // Payload to send to the API
    const payload = JSON.stringify({
        text: message,
    });
    const response = await fetch(BASE_URL + "/api/posts", {
        method: "POST",
        headers: headersWithAuth(),
        body: payload
    });
    const object = await response.json();
    return object;
};

// Calculate the difference between the current time and time posted
function timeAgo(dateString) {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(diffInSeconds / 3600);
    const days = Math.floor(diffInSeconds / (3600 * 24));

    if (minutes < 1) {
        return "Just now";
    } else if (minutes < 60) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    };
};

async function getUserInfo(username) {
    const response = await fetch(BASE_URL + `/api/users/${username}`, {
        method: "GET",
        headers: headersWithAuth(),
    });

    if (response.status === 200) {
        const user = await response.json(); // Convert response to JSON
        displayUserInfo(user); // Call a function to display the user's information
    } else {
        alert("User not found or an error occurred.");
    };
};

async function getUserPosts(username) {
    const response = await fetch(BASE_URL + "/api/posts", {
        method: "GET",
        headers: headersWithAuth(),
    });

    if (response.status === 200) {
        const posts = await response.json();
        return posts.filter(post => post.username === username); // Filter posts by username
    } else {
        console.error("Failed to fetch user posts:", response.statusText);
        return [];
    };
};

async function getUserProfile(username) {
    const response = await fetch(BASE_URL + `/api/users/${username}`, {
        method: "GET",
        headers: headersWithAuth(),
    });

    if (response.status === 200) {
        return response.json();
    } else {
        console.error("Failed to fetch user profile:", response.statusText);
        return null;
    };
};

async function updateUserProfile(username, updates) {
    const response = await fetch(BASE_URL + `/api/users/${username}`, {
        method: "PUT",
        headers: headersWithAuth(),
        body: JSON.stringify(updates),
    });

    if(response.status === 200) {
        return true;
    } else {
        console.error("Failed to fetch user profile:", response.statusText);
        return false;
    };
};

async function deletePost(postId) {
    const response = await fetch(BASE_URL + `/api/posts/${postId}`, {
        method: "DELETE",
        headers: headersWithAuth(),
    });

    if(response.status === 202){
        console.log("Your post has been deleted");
        return true;
    } else {
        console.error("Failed to delete post:", response.statusText);
    };
};


document.addEventListener("DOMContentLoaded", ()=>{
    if (localStorage.token) {
        loginHtml.style.display = "none"
        regHtml.style.display = "none"
        topPostHeader.style.display = "block"
    } else {
        createHtml.style.display = "none"
        postHtml.style.display = "none"
        profileHtml.style.display = "none"
        topPostHeader.style.display = "none"
    }
});