const Boom = require('boom')
const Common = require('../config/common')
const Jwt = require('jsonwebtoken')
const randomstring = require("randomstring")
const PRIVATE_KEY = global.config.privateKey

const User = require('../models/user').User

exports.create = (req, res) => {
  req.body.password = Common.encrypt(req.body.password)

  User.saveUser(req.body, (err, user) => {
    if (!err) {
      const tokenData = {
        username: user.username,
        id: user._id
      }
      console.log('TOKEN DATA', tokenData);
      Common.sentMailVerificationLink(user,Jwt.sign(tokenData, PRIVATE_KEY))
      return res.send(Boom.forbidden("Please confirm your email id by clicking on link in email"))
    } else {
      if (11000 === err.code || 11001 === err.code) {
        return res.send(Boom.forbidden("please provide another user email"))
      } else {
        return res.send(Boom.forbidden(err)); // HTTP 403
      }
    }
  })

}

exports.verifyEmail = (req, res) => {
  Jwt.verify(req.params.token, PRIVATE_KEY, (error, decoded) => {
    if (decoded === undefined) {
      return res.send(Boom.forbidden("invalid verification link"))
    }

    User.findUserByIdAndUserName(decoded.id, decoded.username, (err, user) => {
      if (err) {
        return res.send(Boom.badImplementation(err))
      }
      if(user=== null) {
        return res.send(Boom.forbidden("invalid verification link"))
      }
      if (user.isVerified === true) {
        return res.send(Boom.forbidden("account is already verifid"))
      }
      user.isVerified = true
      User.updateUser(user, (err, user) => {
        if (err) {
          return res.send(Boom.badImplementation(err))
        } else {
          return res.send(Boom.forbidden("account sucessfully verified"))
        }
      })
    })
  })
}

exports.login = (req, res) => {
  User.findUser(req.body.username, (err, user) => {
    if (!err) {
      if (user === null) {
        return res.send(Boom.forbidden("invalid username or password"))
      }

      if (req.body.password === Common.decrypt(user.password)) {
        if (!user.isVerified) {
          return res.send(Boom.forbidden("Your email address is not verified. please verify your email address to proceed"))
        } else {
          let tokenData = {
            username: user.username,
            id: user._id
          }
          let result = {
            username: user.username,
            token: Jwt.sign(tokenData, PRIVATE_KEY)
          }
          return res.json(result)
        }
      } else {
        return res.send(Boom.forbidden("invalid username or password"))
      }
    } else {
      if (11000 === err.code || 11001 === err.code) {
        return res.send(Boom.forbidden("please provide another user email"))
      } else {
        return res.send(Boom.badImplementation(err))
      }
    }

  })
}

exports.resendVerificationEmail = (req, res) => {
  User.findUser(req.body.username, (err, user) => {
    if (!err) {
      if (user === null) {
        return res.send(Boom.forbidden("invalid username or password"))
      }
      if (req.body.password === Common.decrypt(user.password)) {
        if (user.isVerified) {
          return res.send(Boom.forbidden("your email address is already verified"))
        } else {
          let tokenData = {
            userName: user.userName,
            id: user._id
          }
          Common.sentMailVerificationLink(user, Jwt.sing(tokenData, PRIVATE_KEY))
          return res.send(Boom.forbidden("account verification link is sucessfully send to an email id"))
        }
      }else {
        return res.send(Boom.forbidden("invalid username or password"))
      }
    } else {
      console.error(err);
      return res.send(Boom.badImplementation(err))
    }
  })
}

exports.forgotPassword = (req, res) => {
  const random = Common.encrypt(randomstring.generate({length: 5, charset: 'alphabetic'}))
  console.log('RAMDOM', random);
  User.findUserUpdate({username: req.body.username}, {password: random}, (err, user) => {
    console.log('USERRRR', user);
    if (!err) {
      if (user === null) {
        return res.send(Boom.forbidden("invalid username"))
      } else {
        user.password = random
        Common.sentMailForgotPassword(user)
        return res.send("password is send to registered email id")
      }
    } else {
      return res.send(Boom.badImplementation(err))
    }
  })
}

exports.protegido = (req, res) => {
  return res.send('Es una ventana protegida')
}
