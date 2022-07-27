var token = localStorage.getItem('token')
const myForm = document.querySelector('#chat-form')
const msg = document.getElementById('message')
const messages=document.getElementById('messages')
const myGroupitems=document.getElementById('myGroupitems')
const gtitle=document.getElementById('gtitle')
var currentGroup = localStorage.getItem('currentGroup')
const btn = document.getElementById("btn");
const nav = document.getElementById("nav");

btn.addEventListener("click", () => {
    nav.classList.toggle("active");
    btn.classList.toggle("active");
});

document.addEventListener('DOMContentLoaded', displayMessages(),myGroups(),StoreinLocalStorage())
myForm.addEventListener('submit', onSend);
function onSend(e) 
{
    //e.preventDefault();
    //alert("varu")
    token = localStorage.getItem('token')
    gid = localStorage.getItem('currentGroup')
    axios.post(`http://localhost:3000/postGroupMessage/${gid}`,{message:msg.value}, { headers:{"Authorization":token}})
    .then((res) => {msg.value='';})
    .catch(err => {console.log(err)})    
}


setInterval(() =>{StoreinLocalStorage();displayMessages();myGroups();},1000)


function displayMessages()
{
    if(localStorage.getItem('messages'))
    {
        messages.innerHTML=``
        JSON.parse(localStorage.getItem('messages')).forEach(Element => {
            let messageBox = document.createElement("div")
            messageBox.innerHTML = `<div class='message-box'><strong>${Element.user.name} : </strong>${Element.message}</div>`;
            messages.append(messageBox)    
        });
    }
}



function StoreinLocalStorage()
{
    const lastMsgId = localStorage.getItem('lastMsgId')
    currentGroup = localStorage.getItem('currentGroup')
    axios.get(`http://localhost:3000/getGroupMessages/${currentGroup}/${lastMsgId}`)
    .then((res)=>{
        if(lastMsgId!==JSON.stringify(res.data.lastMessageId))
        {
            var ObjectsPresent=[]
            if(localStorage.getItem('messages'))
            {ObjectsPresent=JSON.parse(localStorage.getItem('messages'))}
            ObjectsPresent.push(...res.data.messages)
            let ObjectsPresent_serialized = JSON.stringify(ObjectsPresent)
            localStorage.setItem('messages',ObjectsPresent_serialized)
            localStorage.setItem('lastMsgId',res.data.lastMessageId)
        }   
})
}



function myGroups()
{
axios.get("http://localhost:3000/getGroupsOfaUser", {headers:{"Authorization":token}})
.then((res)=> { myGroupitems.innerHTML=''
    res.data.forEach(Element => {
    let groupBox = document.createElement("div")
    groupBox.innerHTML = `<button class="group-box" value=${Element.gname} id=${Element.id}>${Element.gname}</button>`;
    myGroupitems.append(groupBox)    });
})
}

async function createGroup()
{
    let gname = prompt("Please enter Group's Name");
    const CG = await axios.post("http://localhost:3000/postGroup",{gname: gname}, {headers:{"Authorization":token}})
} 


myGroupitems.addEventListener('click',(e)=>{
    if (e.target.className=='group-box')
    {
        localStorage.setItem('lastMsgId',-1)
        localStorage.removeItem('messages')
        const gid = e.target.id
        const gname = e.target.value
        messages.innerHTML=``
        gtitle.innerHTML=`<h3>${gname}</h3>`
        localStorage.setItem('currentGroup',gid)    
    }
})


async function addUser()
{
    currentGroup = localStorage.getItem('currentGroup')
    if(currentGroup)
    {
    userPNumber=prompt("Enter User's number to add")
    const AU = await axios.post("http://localhost:3000/addUser",{gid: currentGroup,pNumber:userPNumber})
    }    
}


async function makeUserAsAdmin()
{
    currentGroup = localStorage.getItem('currentGroup')
    const NApNumber = prompt("Enter New Admin's Number")
    const UA = await axios.post("http://localhost:3000/MakeAsAdmin",{gid: currentGroup,NApNumber:NApNumber}, { headers:{"Authorization":token}})
}


async function removeUser()
{
    currentGroup = localStorage.getItem('currentGroup')
    const RUpNumber = prompt("Enter User's Number to be Removed")
    const RU = await axios.post("http://localhost:3000/removeUser",{gid: currentGroup,RUpNumber:RUpNumber}, { headers:{"Authorization":token}})
}