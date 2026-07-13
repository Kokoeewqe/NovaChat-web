function addMessage(data){


const div =
document.createElement("div");


div.className="msg";



if(
currentUser &&
data.username === currentUser.username
){

div.classList.add(
"my-msg"
);

}
else{

div.classList.add(
"other-msg"
);

}



div.innerHTML=

`

<b>
${data.username || data.sender_name}
</b>

<br>

${data.text}

`;



messages.appendChild(div);



messages.scrollTop =
messages.scrollHeight;


}
