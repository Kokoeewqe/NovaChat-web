async function register(){


const username =
document.getElementById("reg-name").value;


const email =
document.getElementById("reg-email").value;


const password =
document.getElementById("reg-password").value;



try{


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



console.log(data);



if(data.error){

alert(data.error);

return;

}



alert(
"Аккаунт успешно создан!"
);



showLogin();



}

catch(e){


console.log(e);


alert(
"Ошибка подключения к серверу"
);


}


}
