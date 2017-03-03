const User = require('../controllers/user')

module.exports = (app) => {
  app.post('/user', User.create)
  app.get('/verifyEmail/:token', User.verifyEmail);
  app.post('/login', User.login)
}
