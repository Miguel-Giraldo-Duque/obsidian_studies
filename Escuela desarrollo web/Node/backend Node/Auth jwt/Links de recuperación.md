

En todo proceso de [[Autentificación y autorización]]  necesitamos darle a el usuario la posibilidad de obtener una forma de recuperar la cuenta , para ello podemos usar el envió de correos para la recuperación


Una librería en Node que permite esta creación es  nodeMailer que lo podemos usar del siguiente modo:

````bash
npm i nodemailer
````` 

	
Ahora para usarlo 

````js
// Env
// EMAIL_PERSONAL = "miguelgiradu@gmail.com"
// EMAIL_PASS = "yvphzjhvgjnofuni" --> Contraseña aplicacion de google :)

const nodemailer = require("nodemailer");

require("dotenv").config()

const transporter = nodemailer.createTransport({

  host: "smtp.gmail.com",

  port: 465,

  secure: true, // Use `true` for port 465, `false` for all other ports

  auth: {

    user: process.env.EMAIL_PERSONAL,

    pass: process.env.EMAIL_PASS,

  },

});

  

// async..await is not allowed in global scope, must use a wrapper

async function main() {

  // send mail with defined transport object

  const info = await transporter.sendMail({

    from: process.env.EMAIL_PERSONAL, // sender address

    to: "miguelgiradu@gmail.com", // list of receivers

    subject: "Chico sexy ✔", // Subject line

    text: "Papasito rico lindo", // plain text body

    html: "<b>Pa cuando un parchesito pues?</b>", // html body

  });

  

  console.log("Message sent: %s", info.messageId);

  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>

}

  

main().catch(console.error);
````


Ahora para usar nodemailer con gmail necesitamos pasarle una cuenta gmail eficiente para hacerlo hay que dirigirse a la cuenta de google a la sección de seguridad activar la verificación en dos pasos y en el buscador ir a contraseña de aplicacion le damos un nombre y nos entregara un codigo con el que nos podemos conectar


Para  generar nuestros links de verificacion  podemos hacer lo siguiente

````js
// Env
// EMAIL_PERSONAL = "miguelgiradu@gmail.com"
// EMAIL_PASS = "yvphzjhvgjnofuni" --> Contraseña aplicacion de google :)

const nodemailer = require("nodemailer");

require("dotenv").config()

// Creamos un token por 15 min despues de hacer la verificacion del correo para este token es recomendabble usar otro secret 
const token = jwt.sign(payload,secret2 ,{expiresIn: "15min"});
// Creamos un link con el token en el cual se dirijiria al un fronted para la recuperacion
const link = `htpp://frontedService.com/recovery?token=${token}`;
await service.update(user.id , {recoveryToken:token})
const transporter = nodemailer.createTransport({

  host: "smtp.gmail.com",

  port: 465,

  secure: true, // Use `true` for port 465, `false` for all other ports

  auth: {

    user: process.env.EMAIL_PERSONAL,

    pass: process.env.EMAIL_PASS,

  },

});

  

// async..await is not allowed in global scope, must use a wrapper

async function main() {

  // send mail with defined transport object

  const info = await transporter.sendMail({

    from: process.env.EMAIL_PERSONAL, // sender address
    to: `${user.email}`, // list of receivers
    subject: "Mensaje de recuperacion", // Subject line
    html: `<b>Tu link de recuperacion => ${link} </b>`, //Le pasamos el link 

  });

  

  console.log("Message sent: %s", info.messageId);

  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>

}

  

main().catch(console.error);
````

Para la verificación  es clave verificar si ese token es el mismo en mi base de datos
que el sub del payload contiene una id valida en mi sistema y con alguna funcion de update crear un cambio de contraseña

````js
async (req, res, next) =>{

  try {
	// Recibimos los parametros
    const {token, newPassword} = req.body
    const payload = jwt.verify(token, secret)

  
	// Verificamos si en nuestra base de datos existe
    const user = await service.findOne(payload.sub)

	// Si el token guardado en ese usario no es el mismo envio error esto lo hacemos por que si bien sabemos que el token es valido  no me asegura que sea el mismo en mi usuario 
    if (user.recoveryToken != token) {

      next("No estas autorizado")

    }
// Si todo sale bien lo actualizamos
    await service.update(user.id , {recoveryToken: null, password: newPassword})

    res.send("Contraseña cambiada!")

  

  } catch (error) {

      next(error)

  }

})
````