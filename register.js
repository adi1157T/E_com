document.querySelector('#register-btn').addEventListener('click', function() {
  event.preventDefault()

  let username = document.querySelector('#username').value
  let password = document.querySelector('#password').value
  let confirm_password = document.querySelector('#confirm-password').value
  let email    = document.querySelector('#email').value
  if (username === "" || password === ""|| email ==="" || confirm_password ==="" ) {
    document.querySelector('#error-msg').textContent = "Please fill all fields"
  }

  else if (password.length<8){
    document.querySelector('#error-msg').textContent = "Password must be at least 8 charachters"
  }
  else if (password != confirm_password){
    document.querySelector('#error-msg').textContent = "Password must be same"
  }
  else {
    document.querySelector('#error-msg').textContent = "Registeration Successful"
}
})