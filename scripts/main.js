const BASE_URL = "http://microbloglite.us-east-2.elasticbeanstalk.com"
const NO_AUTH_HEADERS = {'accept': 'application/json','Content-Type': 'application/json'}
// Insecure Token Free Actions (Only 2)

// Create user - sign up
async function signUp(username, fullname, password) {
    const payload = JSON.stringify(
        { "username": username, "fullName": fullName, "password": password }
    );
    const response = await fetch(BASE_URL + "/api/users", {
        method: "Post",
        header: NO_AUTH_HEADERS,
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
        method: "Post",
        header: NO_AUTH_HEADERS,
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

// All the Other need a Token in the Header

// Get secure list of messages using token

// response = fetch(URL, {
//     method: "GET",
//     headers: {
//         Authorization: `Bearer ${loginData.token}`
//     },
// });