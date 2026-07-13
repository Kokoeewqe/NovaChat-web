const SERVER = "https://novachat-server2.onrender.com";


const socket = io(SERVER);



let currentUser = null;

let selectedUser = null;

let typingTimer = null;



const messagesBox =
document.getElementById("messages");




// ==========================
// HELPERS
// ==========================


function saveUser(user){

localStorage.setItem(
"user",
JSON.stringify(user)
);

}



function getUser(){

const user =
localStorage.getItem("user");


return user ?
JSON.parse(user)
:
null;

}




function showError(text){

alert(text);

}





// ==========================
// AUTH
// ==========================


function showLogin(){

document.getElementById(
"login-form"
).style.display="block";


document.getElementById(
"register-form"
).style.display="none";

}





function showRegister(){

document.getElementById(
"login-form"
).style.display="none";


document.getElementById(
"register-form"
).style.display="block";

}







async function register(){


const username =
document.getElementById(
"reg-name"
).value.trim();



const email =
document.getElementById(
"reg-email"
).value.trim();



const password =
document.getElementById(
"reg-password"
).value;



if(!username || !email || !password){

return showError(
"Заполни все поля"
);

}



const res =
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



const data =
await res.json();



if(data.error){

return showError(
data.error
);

}



alert(
"Аккаунт создан"
);



showLogin();


}









async function login(){


const email =
document.getElementById(
"login-email"
).value.trim();



const password =
document.getElementById(
"login-password"
).value;



const res =
await fetch(

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

return showError(
data.error
);

}



saveUser(
data.user
);



openChat(
data.user
);



}









// ==========================
// OPEN CHAT
// ==========================


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
).innerText =
user.username;



socket.emit(
"online",
user
);



loadUsers();


}









// ==========================
// USERS
// ==========================


async function loadUsers(){


const res =
await fetch(

SERVER+"/users"

);



const users =
await res.json();



const box =
document.getElementById(
"users-list"
);



box.innerHTML="";



users.forEach(user=>{


if(user.id===currentUser.id)
return;



const div =
document.createElement("div");



div.className="user";



div.dataset.id =
user.id;



div.innerHTML = `

👤 ${user.username}

`;



div.onclick=()=>{

selectedUser=user;

openPrivate(user);

};



box.appendChild(div);



});



}









function openPrivate(user){


document.querySelector(
".chat-header h2"
).innerText =
user.username;



loadPrivateMessages();


}









async function loadPrivateMessages(){


if(!selectedUser)
return;



const res =
await fetch(

SERVER+

"/private/"+

currentUser.id+

"/"+

selectedUser.id

);



const data =
await res.json();



messagesBox.innerHTML="";



data.forEach(
renderMessage
);


}









// ==========================
// SOCKET EVENTS
// ==========================



socket.on(

"history",

(data)=>{


messagesBox.innerHTML="";


data.forEach(
renderMessage
);


});





socket.on(

"message",

msg=>{


renderMessage(msg);


});







socket.on(

"privateMessage",

msg=>{


if(

selectedUser &&

msg.sender_id===selectedUser.id

){


renderMessage(msg);


}


});







socket.on(

"onlineUsers",

(users)=>{


document
.querySelectorAll(".user")
.forEach(el=>{


el.innerHTML =
"👤 "+el.innerText.replace("🟢 ","");


});



users.forEach(u=>{


const el =
document.querySelector(

`[data-id="${u.id}"]`

);



if(el){

el.innerHTML =
"🟢 "+u.username;

}


});


});










// ==========================
// MESSAGES
// ==========================


function renderMessage(msg){



const div =
document.createElement("div");



div.className="msg";



if(

currentUser &&

(msg.username===currentUser.username ||

msg.sender_name===currentUser.username)

){

div.classList.add(
"my-msg"
);

}



const time =
new Date(

msg.created_at ||

Date.now()

)
.toLocaleTimeString([],{

hour:"2-digit",

minute:"2-digit"

});




div.innerHTML = `


<b>
${msg.username || msg.sender_name}
</b>


<br>

${msg.text}


<br>

<small>
${time}
</small>


`;



messagesBox.appendChild(div);



messagesBox.scrollTop =
messagesBox.scrollHeight;


}









// ==========================
// SEND
// ==========================


function sendMessage(){


const input =
document.getElementById(
"message-text"
);



const text =
input.value.trim();



if(!text)
return;



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


text

}

);



}

else{


socket.emit(

"message",

{

username:
currentUser.username,

text

}

);


}



input.value="";


}










// ==========================
// TYPING
// ==========================


const input =
document.getElementById(
"message-text"
);



if(input){


input.addEventListener(

"input",

()=>{


socket.emit(
"typing",
currentUser?.username
);



clearTimeout(
typingTimer
);



typingTimer=setTimeout(()=>{


socket.emit(
"stopTyping"
);


},1000);



}

);


}








socket.on(

"typing",

(name)=>{


const header =
document.querySelector(
".chat-header span"
);



header.innerText =
name+" печатает...";


});





socket.on(

"stopTyping",

()=>{


document.querySelector(
".chat-header span"
).innerText=
"🟢 online";


});









// ==========================
// START
// ==========================


window.onload=()=>{


const user =
getUser();



if(user){

openChat(user);

}


};








function logout(){


localStorage.clear();


location.reload();


}
