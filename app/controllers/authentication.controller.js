import bcryptjs from 'bcryptjs';
import jsonWebToken from 'jsonwebtoken';
import dotenv from 'dotenv';
//dotenv nos ayuda a hacer variables de entorno (no deberian publicarse nunca a la 
//vista del cliente ya que pueden ser sensibles)
dotenv.config();
const usuarios = [{
    user: "a",
    email: "a@a.com",
    celular: "974052815",
    password: "$2a$05$iehz./VUZQPg2KvtBVufMO6YEF.1k6sYnSjjZYfIdY9DdF3t399Qi"
}]

async function login(req,res){
    console.log(req.body);
    const user = req.body.user;
    const password = req.body.password;
    if(!user || !password){
        return res.status(400).json({message:"Los datos están incompletos"});
    }
    const usuarioArevisar = usuarios.find(usuario => usuario.user === user);
    if(!usuarioArevisar){
        return res.status(400).json({message:"Error durante el Login"});
    }
    const loginCorrecto = await bcryptjs.compare(password,usuarioArevisar.password);
    if(!loginCorrecto){
        return res.status(400).json({message:"Error durante el Login"});
    }
    const token = jsonWebToken.sign({user:usuarioArevisar.user}
        ,process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRES_IN});

    const cookieOption = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        path: "/"
    }
    res.cookie("jwt",token,cookieOption);
    res.send(({status:"ok",message:"Usuario loggeado",redirect:"/admin"}));
}

async function register(req,res){
    console.log(req.body);
    const user = req.body.user;
    const email = req.body.email;
    const celular = req.body.celular;
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;
    const celularRegex = /^9\d{8}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@/;
    const usuarioArevisar = usuarios.find(usuario => usuario.user === user);
    if(usuarioArevisar){
        return res.status(400).json({message:"El usuario ya existe"});
    }
    if(!user || !email || !celular || !password || !passwordConfirm){
        return res.status(400).json({message:"Los datos están incompletos"});
    }
    if(!celularRegex.test(celular)){
        return res.status(400).json({message:"Número de celular inválido"});
    }
    if (!emailRegex.test(email)) {
        alert("La parte izquierda del correo electrónico es inválida.");
        return;
    }
    if(password !== passwordConfirm){
        return res.status(400).json({message:"Las contraseñas no coinciden"});
    }
    if(password.length < 8){
        return res.status(400).json({message:"La contraseña debe tener al menos 8 caracteres"});
    }

    const salt = await bcryptjs.genSalt(5);
    const hashPassword = await bcryptjs.hash(password,salt);
    const nuevoUsuario = {
        user,email,celular,password:hashPassword
    }
    console.log(nuevoUsuario);
    usuarios.push(nuevoUsuario);
    res.status(201).send({status:"ok" ,message:`Usuario ${nuevoUsuario.user} creado`,redirect:"/"});
}

export const methods = {
    login,
    register
}