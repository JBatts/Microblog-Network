const BASE_URL = "http://microbloglite.us-east-2.elasticbeanstalk.com"
const NO_AUTH_HEADERS = { 'accept': 'application/json', 'Content-Type': 'application/json' };
// Insecure Token Free Actions (Only 2)

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

async function logOut(){
    const response = await fetch(BASE_URL + "/auth/logout", {
        method: "GET",
    });
    const object = await response.json();
    return object;
}

function getLoginStatus(){
    console.log("Current localStorage:", localStorage)
    if(!localStorage.token){
        alert(`You must log in to access this page!`);
        window.location.href = "login.html";
        return;
    };
}
// All the Other need a Token in the Header
function headersWithAuth() {
    // Same as No Auth but with Auth Added
    return {
        ...NO_AUTH_HEADERS,
        'Authorization': `Bearer ${localStorage.token}`,
    }
}
// Get secure list of messages using token
async function getMessageList() {
    const LIMIT_PER_PAGE = 1000;
    const OFFSET_PAGE = 0;
    const queryString = `?limit=${LIMIT_PER_PAGE}&offset=${OFFSET_PAGE}`
    const response = await fetch(
        BASE_URL + "/api/posts" + queryString, {
        method: "GET",
        headers: headersWithAuth(),
    });
    const object = await response.json();
    return object;
};

// Add like to the post
async function addLikes(postId) {
    if (!localStorage.token) {
        console.error("User not authenticated. Token missing.");
        return;
    }

    const payload = JSON.stringify({
        postId: postId,
    });

    try {
        console.log(`Sending like for post ID: ${postId}`);

        const response = await fetch(BASE_URL + "/api/likes", {
            method: "POST",
            headers: headersWithAuth(),
            body: payload,
        });

        if (response.status === 201) {
            const message = await response.json();
            console.log("Like added successfully:", message);
            updateLikeCount(message)
        } else {
            console.error("Failed to add like:", response.statusText);
        }
    } catch (error) {
        console.error("Network error:", error);
    }
}

async function createMessage(subject, message){
    // Payload to send to the API
    const payload = JSON.stringify({
        text: message,
        subject: subject,
    });
    const response = await fetch(BASE_URL + "/api/posts", {
        method : "POST",
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
    }
}