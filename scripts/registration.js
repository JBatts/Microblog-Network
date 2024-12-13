document.addEventListener("DOMContentLoaded", () => {
    signUpBtn.addEventListener("click",async () => {
        const result = await signUp(username.value, fullName.value, password.value);
        if("Conflict" === result){ 
            output.innerText = "Username already exist please try again"
            return;
        }
        // Success
        window.location.href = "login.html"
    }); // End Click
}); // End load