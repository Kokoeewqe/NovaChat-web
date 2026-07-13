const SERVER = "https://novachat-server2.onrender.com";


const socket = io(SERVER);



let currentUser = null;

let selectedUser = null;



const messagesBox =
document.getElementById("messages");





// ======================
// AUTH
// ======================


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
document.getElementById("reg-name").value.trim();


const email =
document.getElementById("reg-email").value.trim();


const password =
document.getElementById("reg-password").value;



if(!username || !email || !password){

alert("Заполни все поля");

return;

}



try{


const response = await fetch(

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

}

);



const data =
await response.json();



if(data.error){

alert(data.error);

return;

}



alert(
"Аккаунт создан!"
);



showLogin();



}

catch(error){


console.log(error);


alert(
"Сервер недоступен"
);


}


}









async function login(){


const email =
document.getElementById("login-email").value.trim();



const password =
document.getElementById("login-password").value;



try{


const response = await fetch(

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
await response.json();



if(data.error){

alert(data.error);

return;

}



localStorage.setItem(

"user",

JSON.stringify(data.user)

);



openChat(data.user);



}

catch(error){

console.log(error);

alert(
"Ошибка подключения"
);


}


}









// ======================
// CHAT START
// ======================


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
document.getElementById(
"user-avatar"
).innerText =
user.avatar || "👤";


document.getElementById(
"user-status"
).innerText =
user.status || "online";


if(user.created_at){

document.getElementById(
"user-date"
).innerText =
"С нами с " +
new Date(user.created_at)
.toLocaleDateString();

}



socket.emit(

"online",

user

);



loadUsers();



}









// ======================
// USERS
// ======================


async function loadUsers(){


const response =
await fetch(

SERVER+"/users"

);



const users =
await response.json();



const box =
document.getElementById(
"users-list"
);



box.innerHTML="";



users.forEach(user=>{


if(user.id===currentUser.id)
return;



const item =
document.createElement("div");



item.className="user";



item.dataset.id=user.id;



item.innerHTML=

`
👤 ${user.username}
`;



item.onclick=()=>{


selectedUser=user;


document.querySelector(
".chat-header h2"
).innerText=user.username;



loadPrivateMessages();



};



box.appendChild(item);



});



}









// ======================
// PRIVATE HISTORY
// ======================


async function loadPrivateMessages(){


if(!selectedUser)
return;



const response =
await fetch(

SERVER+

"/private/"+

currentUser.id+

"/"+

selectedUser.id

);



const data =
await response.json();



messagesBox.innerHTML="";



data.forEach(
showMessage
);


}









// ======================
// SOCKET
// ======================



socket.on(

"history",

(data)=>{


messagesBox.innerHTML="";


data.forEach(
showMessage
);


});






socket.on(

"message",

(data)=>{


showMessage(data);


});






socket.on(

"privateMessage",

(data)=>{


if(

selectedUser &&

data.sender_id===selectedUser.id

){


showMessage(data);


}


});









// ======================
// ONLINE
// ======================


socket.on(

"onlineUsers",

(users)=>{


document
.querySelectorAll(".user")
.forEach(
el=>{


let name =
el.innerText.replace(
"🟢 ",
""
);


el.innerText=
"👤 "+name;


});


users.forEach(user=>{


const element =
document.querySelector(

`[data-id="${user.id}"]`

);



if(element){

element.innerText =
"🟢 "+user.username;

}


});


});









// ======================
// MESSAGE
// ======================


function showMessage(data){



const div =
document.createElement("div");



div.className="msg";



if(

currentUser &&

(data.username===currentUser.username ||

data.sender_name===currentUser.username)

){

div.classList.add(
"my-msg"
);

}



const time =
new Date()
.toLocaleTimeString([],{

hour:"2-digit",

minute:"2-digit"

});



div.innerHTML=

`

<b>
${data.username || data.sender_name}
</b>

<br>

${data.text}

<br>

<small>
${time}
</small>

`;



messagesBox.appendChild(div);



messagesBox.scrollTop =
messagesBox.scrollHeight;



}









// ======================
// SEND
// ======================


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


text:text


}

);



}

else{


socket.emit(

"message",

{

username:
currentUser.username,

text:text


}

);


}



input.value="";


}








// ======================
// AUTO LOGIN
// ======================


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
