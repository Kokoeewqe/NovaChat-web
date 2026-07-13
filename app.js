const SERVER = "https://novachat-server2.onrender.com";


const socket = io(SERVER);



let currentUser = null;



// ==========================
// AUTH FORMS
// ==========================


function showLogin(){

    document.getElementById("login-form").style.display="block";

    document.getElementById("register-form").style.display="none";

}



function showRegister(){

    document.getElementById("login-form").style.display="none";

    document.getElementById("register-form").style.display="block";

}






// ==========================
// REGISTER
// ==========================


async function register(){


const username =
document.getElementById("reg-name").value;


const email =
document.getElementById("reg-email").value;


const password =
document.getElementById("reg-password").value;




const res = await fetch(

SERVER+"/register",

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


}

);



const data =
await res.json();



if(data.error){

alert(data.error);

return;

}



alert(
"Аккаунт создан!"
);


showLogin();



}







// ==========================
// LOGIN
// ==========================


async function login(){


const email =
document.getElementById("login-email").value;


const password =
document.getElementById("login-password").value;




const res = await fetch(

SERVER+"/login",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

email,

password

})

}

);



const data =
await res.json();



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








// ==========================
// OPEN CHAT
// ==========================


function openChat(user){


currentUser=user;



document.getElementById("auth").style.display="none";


document.getElementById("chat-app").style.display="flex";



document.getElementById(
"current-user"
).innerText=user.username;



socket.emit(
"online",
user
);



loadUsers();



}









// ==========================
// LOAD USERS
// ==========================


async function loadUsers(){


const res =
await fetch(

SERVER+"/users"

);



const users =
await res.json();



const sidebar =
document.querySelector(".sidebar");



let block =
document.getElementById(
"users-list"
);



if(!block){


block =
document.createElement("div");

block.id="users-list";


sidebar.appendChild(block);


}




block.innerHTML="";



users.forEach(user=>{


let div =
document.createElement("div");



div.className="user";


div.innerHTML=`

👤 ${user.username}

`;



block.appendChild(div);



});


}









// ==========================
// ONLINE USERS
// ==========================


socket.on(

"onlineUsers",

(users)=>{


document
.querySelectorAll(".user")
.forEach(el=>{


el.innerHTML =
el.innerHTML.replace(
"🟢 ",
""
);


});



users.forEach(u=>{


document
.querySelectorAll(".user")
.forEach(el=>{


if(
el.innerText.includes(
u.username
)
)

{

el.innerHTML=
"🟢 "+u.username;

}


});


});


});









// ==========================
// CHAT HISTORY
// ==========================


const messages =
document.getElementById(
"messages"
);



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

<b>${data.username}</b>

<br>

${data.text}

`;



messages.appendChild(div);


messages.scrollTop =
messages.scrollHeight;


}








// ==========================
// SEND MESSAGE
// ==========================


function sendMessage(){


const input =
document.getElementById(
"message-text"
);



if(
!input.value.trim()
)

return;



socket.emit(

"message",

{

username:
currentUser.username,


text:
input.value


}

);



input.value="";


}








// ==========================
// AUTO LOGIN
// ==========================


window.onload=()=>{


const saved =
localStorage.getItem(
"user"
);



if(saved){


openChat(
JSON.parse(saved)
);


}


};








// ==========================
// LOGOUT
// ==========================


function logout(){


localStorage.removeItem(
"user"
);


localStorage.removeItem(
"token"
);


location.reload();


}
