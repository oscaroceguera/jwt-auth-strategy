const mongoose = require('mongoose')
const Schema = mongoose.Schema

let User = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
})

User.statics = {
  saveUser: function (requestData, cb) {
    this.create(requestData, cb)
  }
}

let user = mongoose.model('user', User)

module.exports = { User: user}
