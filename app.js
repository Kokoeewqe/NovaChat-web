const socket = io();

let currentUser = null;

let token = localStorage.getItem("token");





// =====================
// START
// =====================


window.onload = ()=>{


if(token){


const saved =
localStorage.getItem("user");


if(saved){

currentUser =
JSON.parse(saved);


showChat();


}


}


};







// =====================
// REGISTER
// =====================


async function register(){


const username =
document.getElementById("username").value;


const email =
document.getElementById("email").value;


const password =
document.getElementById("password").value;



const res =
await fetch("/register",{


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



const data =
await res.json();



if(data.token){


localStorage.setItem(
"token",
data.token
);


localStorage.setItem(
"user",
JSON.stringify(data.user)
);



currentUser=data.user;


showChat();


}

else{


alert(data.error);


}


}








// =====================
// LOGIN
// =====================


async function login(){


const email =
document.getElementById("email").value;



const password =
document.getElementById("password").value;



const res =
await fetch("/login",{


method:"POST",


headers:{


"Content-Type":"application/json"


},


body:JSON.stringify({

email,

password

})


});



const data =
await res.json();



if(data.token){


localStorage.setItem(
"token",
data.token
);


localStorage.setItem(
"user",
JSON.stringify(data.user)
);



currentUser=data.user;


showChat();


}


else{


alert(data.error);


}


}









// =====================
// SHOW CHAT
// =====================


function showChat(){


document.getElementById("auth")
.style.display="none";


document.getElementById("chat")
.style.display="block";



document.getElementById("online")
.innerHTML="online";



socket.emit(
"online",
currentUser
);



loadMessages();



loadProfile();


}








// =====================
// PROFILE
// =====================


function loadProfile(){


document.getElementById("profile")
.innerHTML=`

<h2>
${currentUser.username}
</h2>

<p>
${currentUser.email}
</p>

<p>
🚀 NovaChat user
</p>

`;


}







// =====================
// SEND MESSAGE
// =====================


function sendMessage(){


const input =
document.getElementById("message");


const text =
input.value.trim();



if(!text)
return;



socket.emit(

"message",

{


sender_id:
currentUser.id,


username:
currentUser.username,


text


}


);



input.value="";


}







// =====================
// RECEIVE MESSAGE
// =====================


socket.on(
"message",

msg=>{


addMessage(msg);


}

);







function addMessage(msg){


const box =
document.getElementById("messages");



const div =
document.createElement("div");



div.className="message";



if(
currentUser &&
msg.sender_id===currentUser.id
){

div.classList.add("mine");

}



div.innerHTML=`

<b>
${msg.username}
</b>

<br>

${msg.text}

`;



box.appendChild(div);



box.scrollTop =
box.scrollHeight;


}







// =====================
// HISTORY
// =====================


async function loadMessages(){


const res =
await fetch("/messages");


const data =
await res.json();



document.getElementById("messages")
.innerHTML="";



data.forEach(addMessage);


}








// =====================
// TYPING
// =====================


function typing(){


socket.emit(

"typing",

{

username:
currentUser.username

}

);


}





socket.on(
"typing",

data=>{


document.getElementById("typing")
.innerHTML=

data.username+" печатает...";


setTimeout(()=>{


document.getElementById("typing")
.innerHTML="";


},1500);


}

);








// =====================
// USERS ONLINE
// =====================


socket.on(

"onlineUsers",

users=>{


const box =
document.getElementById("users");



box.innerHTML="";



users.forEach(user=>{


box.innerHTML +=`

<p>

🟢 ${user.username}

</p>

`;


});


}

);








// =====================
// LOGOUT
// =====================


function logout(){


localStorage.removeItem("token");

localStorage.removeItem("user");


location.reload();


}
