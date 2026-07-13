const socket = io("https://novachat-server2.onrender.com");


function send() {

    const name = document.getElementById("name").value || "Гость";
    const text = document.getElementById("text").value;

    if (text.trim() === "") {
        return;
    }

    socket.emit("message", {
        name: name,
        text: text
    });

    document.getElementById("text").value = "";

}


socket.on("message", function(data) {

    const messages = document.getElementById("messages");

    const div = document.createElement("div");

    div.className = "msg";

    div.textContent = data.name + ": " + data.text;

    messages.appendChild(div);

    messages.scrollTop = messages.scrollHeight;

});
