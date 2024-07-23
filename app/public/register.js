const mensajeError = document.getElementsByClassName("error")[0];

document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log(e);

    //Para el Backend -> Con el fetch nos comunicamos con el backend
    const res = await fetch("http://localhost:4000/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user: e.target.elements.user.value,
            email: e.target.elements.email.value,
            celular: e.target.elements.celular.value,
            password: e.target.elements.password.value,
            passwordConfirm: e.target.elements.password1.value
        })
    });
    if(!res.ok) return mensajeError.classList.toggle("escondido",false);
    const resJson = await res.json();
    if(resJson.redirect){
        window.location.href = resJson.redirect;
    }
});
