document.addEventListener("DOMContentLoaded", () => {
    getLoginStatus()

        createBtn.addEventListener("click", async (e)=>{
            e.preventDefault();
            const subject = document.getElementById("subject").value;
            const message = document.getElementById("message").value;
            if(!subject || !message){
                feedback.innerText = `Please fill out all fields.`
                return;
            }
    
            const result = await createMessage(subject, message);
    
            if (result.error) {
                feedback.textContent = `Error: ${result.error}`;
            } else {
                feedback.style.color = "green";
                feedback.innerText = "Message posted successfully!";
                postForm.reset(); // Clear the form
            }
        });

    }

);