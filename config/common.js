const nodemailer = require("nodemailer")
const crypto = require('crypto')
const ALGORITHM = global.config.algorithm
const PRIVATE_KEY = global.config.privateKey
var smtpTransport = require('nodemailer-smtp-transport')

var transporter = nodemailer.createTransport( smtpTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: global.config.email.username,
      pass: global.config.email.password
    }
}))

exports.encrypt = (password) => encrypt(password)

// method to encrypt data(password)
function encrypt(password) {
  const cipher = crypto.createCipher(ALGORITHM, PRIVATE_KEY)
  let crypted = cipher.update(password, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

exports.sentMailVerificationLink = (user,token) => {
    var textLink = `http://${global.config.server.host}:${global.config.server.port}/${global.config.email.verifyEmailUrl}/${token}`
    var from = `${global.config.email.accountName} Team<${global.config.email.username}>`
    var mailbody = `<p>Thanks for Registering on ${global.config.email.accountName} </p><p>Please verify your email by clicking on the verification link below.<br/><a href=${textLink.toString()}>Verification Link</a></p>`
    mail(from, user.username , "Account Verification", mailbody);
}

function mail(from, email, subject, mailbody){
    var mailOptions = {
        from: from, // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        //text: result.price, // plaintext body
        html: mailbody  // html body
    };

    transporter.sendMail(mailOptions, function(error, response) {
        if (error) {
            console.error(error);
        }
        transporter.close(); // shut down the connection pool, no more messages
    });
}
