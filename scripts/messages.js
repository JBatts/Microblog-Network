
function getMessage(m){
    return `
    <div data-post_id = "${m._id}" class="message">
        From: ${m.username}<br>\n
        When: ${m.createdAt}<br>\n
        Text: ${m.text}<br>\n
        Likes: ${m.likes.length}
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", async () => {

    const messages = await getMessageList();
    output.innerHTML = messages.map(getMessage).join("<hr>\n");

}); // End load