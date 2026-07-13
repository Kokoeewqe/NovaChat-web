const socket = io("https://novachat-server2.onrender.com");


const messages = document.getElementById("messages");


// Добавление сообщения на экран
function addMessage(data) {

    const div = document.createElement("div");

    div.className = "msg";

    div.textContent = data.name + ": " + data.text;

    messages.appendChild(div);

    messages.scrollTop = messages.scrollHeight;
}


// Получаем историю из базы
socket.on("history", function(history) {

    history.forEach(function(message) {

        addMessage(message);

    });

});


// Отправка сообщения
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


// Новые сообщения
socket.on("message", function(data) {

    addMessage(data);

});
