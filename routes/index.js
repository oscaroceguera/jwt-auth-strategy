const User = require('../controllers/user')
const VerifyToken = require('../middlewares/verifyToken')

module.exports = (app) => {
  app.post('/user', User.create)
  app.get('/verifyEmail/:token', User.verifyEmail)
  app.post('/resendVerificacionEmail', User.resendVerificationEmail)
  app.post('/login', User.login)
  app.post('/forgotPassword', User.forgotPassword)
  app.get('/protegido', VerifyToken, User.protegido)
}
