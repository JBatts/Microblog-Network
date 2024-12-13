const Base_Url = "http://microbloglite.us-east-2.elasticbeanstalk.com"
// Insecure Token Free Actions (Only 2)

// Create user - sign up
async function signUp(username, fullname, password){
    const response = await fetch(Base_Url + "/api/users",  {
        method: "Post",
        body: JSON.stringify({
            "username": username,
            "fullName": fullname,
            "password": password
          })
    }); // end fetch

    // ToDo check for error response status codes

    const object = await response.json();
    return object;
};
const user = signUp("ButterBall", "John Elastic Wick", "illegalTime")
console.log(user);
// Login and store username and token received


// All the Other need a Token in the Header

// Get secure list of messages using token

// response = fetch(URL, {
//     method: "GET",
//     headers: {
//         Authorization: `Bearer ${loginData.token}`
//     },
// });