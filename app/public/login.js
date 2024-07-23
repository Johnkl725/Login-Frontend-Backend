const mensajeError = document.getElementsByClassName("error")[0];
document.getElementById("form-login").addEventListener("submit",async (e)=>{
    e.preventDefault();
    const user = e.target.elements.user.value;
    const password = e.target.elements.password.value;
    const res = await fetch("http://localhost:4000/api/login",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({user,password})
    });
    if(!res.ok) return mensajeError.classList.toggle("escondido",false);
    const resJson = await res.json();
    if(resJson.redirect){
        window.location.href = resJson.redirect;
    }
})