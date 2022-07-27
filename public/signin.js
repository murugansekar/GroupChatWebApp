const myForm = document.querySelector('#signin-form')
const msg = document.querySelector('.msg');
myForm.addEventListener('submit', onSubmit);

function onSubmit(e) 
{
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  e.preventDefault();
  if(email === '' || password === '') 
  {
    msg.innerHTML = 'Please enter all fields*';
    msg.style.color = 'red'
    setTimeout(() => msg.remove(), 5000);
  } 
  else 
  {
    localStorage.clear();
    axios.post("http://localhost:3000/signin",{email:email,password:password}).then(result =>{
      if(result.data.success)
      {
        localStorage.setItem('token',result.data.token)
        localStorage.setItem('lastMsgId',-1)
        alert("Login Successful")
        window.location.replace("./chatApp.html")
      }
      else
        alert("Login failed")

      }).catch(err => console.log(err))
  }
}