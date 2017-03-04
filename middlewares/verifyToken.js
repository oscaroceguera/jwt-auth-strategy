const Boom = require('boom')
const jwt = require('jsonwebtoken')
const PRIVATE_KEY = global.config.privateKey

module.exports = (req, res, next) => {
  const token = req.get('Auth') || ''
  if (token) {
    jwt.verify(token, PRIVATE_KEY, (err, decoded) => {
      if (err) {
        return res.send(Boom.badImplementation(err))
      }
      next()
    })
  } else {
    return res.send(Boom.forbidden('No se encontro el token'))
  }
}
