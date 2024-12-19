document.addEventListener("DOMContentLoaded", () => {
    loginBtn.addEventListener("click",async () => {
        const result = await login(username.value, password.value);
        if(!result || !result.hasOwnProperty("statusCode") || result.statusCode != 200){
            output.innerText = "Login information incorrect please try again"
            return;
        }
        // Success
        window.location.href = "index.html"
    }); // End Click
}); // End load