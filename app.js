const SERVER = "https://novachat-server2.onrender.com";

const socket = io(SERVER);



let currentUser = null;



// =========================
// Переключение форм
// =========================


function showLogin(){

    document.getElementById("login-form").style.display="block";

    document.getElementById("register-form").style.display="none";

}



function showRegister(){

    document.getElementById("login-form").style.display="none";

    document.getElementById("register-form").style.display="block";

}



// =========================
// Регистрация
// =========================


async function register(){


    const username =
    document.getElementById("reg-name").value;


    const email =
    document.getElementById("reg-email").value;


    const password =
    document.getElementById("reg-password").value;




    const res = await fetch(
        SERVER + "/register",
        {

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            username,
            email,
            password

        })

    });



    const data = await res.json();



    if(data.error){

        alert(data.error);

        return;

    }


    alert("Аккаунт создан. Теперь войдите.");

    showLogin();


}






// =========================
// Вход
// =========================


async function login(){


    const email =
    document.getElementById("login-email").value;


    const password =
    document.getElementById("login-password").value;



    const res = await fetch(
        SERVER + "/login",
        {

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            email,
            password

        })

    });



    const data = await res.json();



    if(data.error){

        alert(data.error);

        return;

    }




    localStorage.setItem(
        "token",
        data.token
    );


    localStorage.setItem(
        "user",
        JSON.stringify(data.user)
    );



    openChat(data.user);



}







// =========================
// Открыть чат
// =========================


function openChat(user){


    currentUser=user;


    document.getElementById(
        "auth"
    ).style.display="none";



    document.getElementById(
        "chat-app"
    ).style.display="flex";



    document.getElementById(
        "current-user"
    ).innerText=user.username;



}







// =========================
// Проверяем вход
// =========================


window.onload=()=>{


    const saved =
    localStorage.getItem("user");



    if(saved){


        openChat(
            JSON.parse(saved)
        );


    }


};







// =========================
// Сообщения
// =========================


const messages =
document.getElementById("messages");





socket.on(
"history",
(history)=>{


    messages.innerHTML="";


    history.forEach(
        addMessage
    );


});





socket.on(
"message",
(data)=>{


    addMessage(data);


});







function addMessage(data){


    const div =
    document.createElement("div");



    div.className="msg";



    div.innerHTML=`

        <b>${data.username || data.name}</b>

        <br>

        ${data.text}

    `;



    messages.appendChild(div);


    messages.scrollTop =
    messages.scrollHeight;


}








// =========================
// Отправка
// =========================


function sendMessage(){


    const input =
    document.getElementById(
        "message-text"
    );



    if(!currentUser){

        return;

    }




    if(input.value.trim()===""){

        return;

    }



    socket.emit(
        "message",
        {

        name:
        currentUser.username,


        username:
        currentUser.username,


        text:
        input.value


    });



    input.value="";


}







// =========================
// Выход
// =========================


function logout(){


    localStorage.removeItem("token");

    localStorage.removeItem("user");


    location.reload();


}
