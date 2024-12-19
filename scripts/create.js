document.addEventListener("DOMContentLoaded", () => {
    getLoginStatus()

    createBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const message = document.getElementById("message").value;
        if (!message) {
            feedback.style.display = "block"
            feedback.style.color = "red";
            feedback.innerText = `Please fill out all fields.`
            return;
        };

        const result = await createMessage(message);

        if (result.error) {
            feedback.textContent = `Error: ${result.error}`;
        } else {
            feedback.style.display = "block"
            feedback.style.color = "green";
            feedback.innerText = "Message posted successfully!";
            postForm.reset(); // Clear the form
        };
    });
});