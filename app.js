const socket = io("https://novachat-server2.onrender.com");


const messages = document.getElementById("messages");



function addMessage(data) {

    const div = document.createElement("div");

    div.className = "msg";


    const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });



    div.innerHTML = `

        <b>${data.name}</b>

        <br>

        ${data.text}

        <small style="
            display:block;
            margin-top:8px;
            color:#94a3b8;
            font-size:12px;
        ">
            ${time}
        </small>

    `;


    messages.appendChild(div);


    messages.scrollTop = messages.scrollHeight;

}




// Получаем историю из базы

socket.on("history", (history)=>{


    messages.innerHTML="";


    history.forEach(message=>{

        addMessage(message);

    });


});





// Новое сообщение

socket.on("message",(data)=>{


    addMessage(data);


});





function send(){


    const name =
    document.getElementById("name").value
    || "Гость";



    const text =
    document.getElementById("text").value;



    if(text.trim()===""){

        return;

    }




    socket.emit("message",{


        name:name,

        text:text


    });




    document.getElementById("text").value="";

}
