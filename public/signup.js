const myForm = document.querySelector('#signup-form')
const msg = document.querySelector('.msg');
myForm.addEventListener('submit', onSubmit);

function onSubmit(e) 
{
  const nam = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const pNumber = document.getElementById("pNumber").value;
  const password = document.getElementById("password").value;
  e.preventDefault();
  if(nam === '' || email === '' || pNumber === '' || password === '') 
  {
    msg.innerHTML = 'Please enter all fields*';
    msg.style.color = 'red'
    setTimeout(() => msg.remove(), 5000);
  } 
  else 
  {
    axios.post("http://localhost:3000/signup",{ name:nam,email:email,pNumber:pNumber,password:password}).then(result =>{
      if(result.data.success)
      {
        alert("Successfuly signed up")
        window.location.replace("./signin.html");
      }
      else
        alert("User already exists, Please Login")
      
      }).catch(err => console.log(err))
  }
}