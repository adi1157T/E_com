document.querySelector('#login-btn').addEventListener('click', function() {
  event.preventDefault()
  // 1. read email value
  document.querySelector('#email').value
  // 2. read password value
  document.querySelector('#password').value
  // 3. check if empty
  // 4. check password length
  let email = document.querySelector('#email').value
  let password = document.querySelector('#password').value

  if (email === "" || password === "") {
  document.querySelector('#error-msg').textContent = "Please fill all fields"
  }
  else if (password.length<8){
    document.querySelector('#error-msg').textContent = "Password must be at least 8 charachters"
  }
  else {
  document.querySelector('#error-msg').textContent = "Login Successful"
}
})