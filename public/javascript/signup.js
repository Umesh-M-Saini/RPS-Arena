const alertBox = document.getElementById("alertBox");

function togglePassword(){
let password = document.getElementById("password");
if(password.type === "password"){
    password.type = "text";
}else{
    password.type = "password";
}
}

if(alertBox){
    setTimeout(()=>{
        alertBox.style.display = "none";
    },5000);
}
