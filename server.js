require("dotenv").config()

const express = require("express")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cors())

const PORT = 3000



// ====================================
// BASE DE DATOS SIMULADA
// ====================================

let usuarios = [

{
id:1,
email:"samuelibbbbb@gmail.com",
password:"1234",
rol:"admin",
codigo2FA:null,
refreshToken:null,
libros:["Clean Code","JavaScript Avanzado"]
},

{
id:2,
email:"samuelibbbbb@gmail.com",
password:"1234",
rol:"estudiante",
codigo2FA:null,
refreshToken:null,
libros:["Node.js Basico","Bases de Datos"]
}

]



// ====================================
// CONFIGURACION NODEMAILER
// ====================================

const transporter = nodemailer.createTransport({

service:"gmail",

auth:{
user:process.env.EMAIL_USER,
pass:process.env.EMAIL_PASS
}

})



// ====================================
// LOGIN PASO 1 (ENVIA CODIGO)
// ====================================

app.post("/login-paso1", async (req,res)=>{

const {email,password} = req.body

const usuario = usuarios.find(
u => u.email === email && u.password === password
)

if(!usuario){
return res.status(401).json({mensaje:"Credenciales incorrectas"})
}

const codigo = Math.floor(1000 + Math.random()*9000)

usuario.codigo2FA = codigo

await transporter.sendMail({

from:process.env.EMAIL_USER,
to:usuario.email,
subject:"Codigo de verificacion biblioteca",
text:`Tu codigo de verificacion es: ${codigo}`

})

res.json({mensaje:"Codigo enviado al correo"})

})



// ====================================
// LOGIN PASO 2 (VERIFICA CODIGO)
// ====================================

app.post("/login-paso2",(req,res)=>{

const {email,codigo} = req.body

const usuario = usuarios.find(u => u.email === email)

if(!usuario || usuario.codigo2FA != codigo){
return res.status(401).json({mensaje:"Codigo incorrecto"})
}

const accessToken = jwt.sign(

{id:usuario.id,rol:usuario.rol},
process.env.JWT_SECRET,
{expiresIn:"15s"}

)

const refreshToken = jwt.sign(

{id:usuario.id},
process.env.JWT_SECRET,
{expiresIn:"1d"}

)

usuario.refreshToken = refreshToken

res.json({

accessToken,
refreshToken

})

})



// ====================================
// MIDDLEWARE VALIDAR TOKEN
// ====================================

function verificarToken(req,res,next){

const authHeader = req.headers["authorization"]

if(!authHeader){
return res.status(401).json({mensaje:"Token requerido"})
}

const token = authHeader.split(" ")[1]

jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{

if(err){
return res.status(403).json({mensaje:"Token invalido"})
}

req.user = user
next()

})

}



// ====================================
// RUTA SOLO ESTUDIANTES
// ====================================

app.get("/mi-espacio",verificarToken,(req,res)=>{

if(req.user.rol !== "estudiante"){
return res.status(403).json({mensaje:"Solo estudiantes"})
}

const usuario = usuarios.find(u => u.id === req.user.id)

res.json({

librosPrestados:usuario.libros

})

})



// ====================================
// RUTA SOLO ADMIN
// ====================================

app.get("/dashboard-admin",verificarToken,(req,res)=>{

if(req.user.rol !== "admin"){
return res.status(403).json({mensaje:"Solo admin"})
}

res.json({

inventario:[
"Clean Code",
"JavaScript Avanzado",
"Node.js Basico",
"Bases de Datos"
]

})

})



// ====================================
// REFRESH TOKEN
// ====================================

app.post("/refresh-token",(req,res)=>{

const {refreshToken} = req.body

if(!refreshToken){
return res.status(401).json({mensaje:"Refresh token requerido"})
}

const usuario = usuarios.find(
u => u.refreshToken === refreshToken
)

if(!usuario){
return res.status(403).json({mensaje:"Refresh token invalido"})
}

jwt.verify(refreshToken,process.env.JWT_SECRET,(err)=>{

if(err){
return res.status(403).json({mensaje:"Refresh token expirado"})
}

const nuevoAccessToken = jwt.sign(

{id:usuario.id,rol:usuario.rol},
process.env.JWT_SECRET,
{expiresIn:"50m"}


)

res.json({accessToken:nuevoAccessToken})

})

})



// ====================================
// INICIAR SERVIDOR
// ====================================

app.listen(PORT,()=>{

console.log("Servidor corriendo en puerto "+PORT)

})