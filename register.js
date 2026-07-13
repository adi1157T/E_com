document.querySelector('#register-btn').addEventListener('click',async function(event){
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
    const response = await fetch ('http://localhost:5000/api/auth/register',{
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({name: username, email: email, password: password})
  })
  const data = await response.json()  
  
  if (response.ok) {
    localStorage.setItem('token', data.token)
    window.location.href = 'login.html'
  } else {
    document.querySelector('#error-msg').textContent = data.message
  }

}
})