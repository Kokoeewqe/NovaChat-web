const SERVER = "https://novachat-server2.onrender.com";

const socket = io(SERVER);


let currentUser = null;

let selectedUser = null;



// =========================
// AUTH
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
// LOGIN
// =========================


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
"user",
JSON.stringify(data.user)
);



localStorage.setItem(
"token",
data.token
);



openChat(data.user);


}







// =========================
// REGISTER
// =========================


async function register(){


const username =
document.getElementById("reg-name").value;


const email =
document.getElementById("reg-email").value;


const password =
document.getElementById("reg-password").value;



await fetch(

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



alert(
"Аккаунт создан"
);


showLogin();


}








// =========================
// OPEN CHAT
// =========================


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








// =========================
// USERS
// =========================


async function loadUsers(){


const res =
await fetch(

SERVER+"/users"

);



const users =
await res.json();



let list =
document.getElementById(
"users-list"
);



if(!list){


list =
document.createElement("div");

list.id="users-list";


document
.querySelector(".sidebar")
.appendChild(list);


}



list.innerHTML="";



users.forEach(user=>{


if(user.id === currentUser.id)
return;



const div =
document.createElement("div");



div.className="user";


div.innerHTML=

`

👤 ${user.username}

`;



div.onclick=()=>{

openPrivateChat(user);

};



list.appendChild(div);



});


}








// =========================
// PRIVATE CHAT
// =========================


function openPrivateChat(user){


selectedUser=user;



document.querySelector(
".chat-header h2"
).innerText=

user.username;



loadPrivateMessages();


}







async function loadPrivateMessages(){


const res =
await fetch(

SERVER+

"/private/"+

currentUser.id+

"/"+

selectedUser.id

);



const msgs =
await res.json();



messages.innerHTML="";



msgs.forEach(addMessage);


}









// =========================
// MESSAGES
// =========================


const messages =
document.getElementById(
"messages"
);




socket.on(

"history",

(data)=>{


messages.innerHTML="";


data.forEach(addMessage);


});





socket.on(

"message",

(data)=>{


addMessage(data);


});





socket.on(

"privateMessage",

(data)=>{


if(

selectedUser &&

data.sender_id===selectedUser.id

){


addMessage(data);


}


});








function addMessage(data){


const div =
document.createElement("div");


div.className="msg";


div.innerHTML=

`

<b>${data.username || data.sender_name}</b>

<br>

${data.text}

`;



messages.appendChild(div);


messages.scrollTop =
messages.scrollHeight;


}








// =========================
// SEND
// =========================


function sendMessage(){


const input =
document.getElementById(
"message-text"
);



if(!input.value.trim())
return;



// личное сообщение

if(selectedUser){


socket.emit(

"privateMessage",

{

sender_id:
currentUser.id,


receiver_id:
selectedUser.id,


sender_name:
currentUser.username,


text:
input.value


}

);


}

else{


socket.emit(

"message",

{

username:
currentUser.username,

text:
input.value


}

);


}



input.value="";


}









// =========================
// AUTO LOGIN
// =========================


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







function logout(){


localStorage.clear();

location.reload();


}
