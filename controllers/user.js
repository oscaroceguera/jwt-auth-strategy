const Boom = require('boom')
const Common = require('../config/common')
const Jwt = require('jsonwebtoken')
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
