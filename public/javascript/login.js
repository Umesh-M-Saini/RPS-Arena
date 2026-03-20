const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");
const alertBox = document.getElementById("alertBox");

togglePassword.addEventListener("click", function () {
  if (password.type === "password") {
    password.type = "text";
  } else {
    password.type = "password";
  }
});

setTimeout(() => {
    if(alertBox){
        alertBox.style.display = "none";
    }
}, 3000);
