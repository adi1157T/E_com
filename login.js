document.querySelector('#login-btn').addEventListener('click',async function(event){
  event.preventDefault()
  // 1. read email value
  // 2. read password value
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
  const response = await fetch ('http://localhost:5000/api/auth/login',{
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email, password})
  })
  const data = await response.json()  
  
  if (response.ok) {
    localStorage.setItem('token', data.token)
    window.location.href = 'index.html'
  } else {
    document.querySelector('#error-msg').textContent = data.message
  }
  }
  })