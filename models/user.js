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
  },
  findUserByIdAndUserName: function (id, username, cb) {
    this.findOne({username, _id: id}, cb)
  },
  updateUser: function(user, callback) {
    user.save(callback);
  },
  findUser: function (username, cb) {
    this.findOne({username}, cb)
  },
  findUserUpdate: function (query, user, cb) {
    this.findOneAndUpdate(query, user, cb)
  }
}

let user = mongoose.model('user', User)

module.exports = { User: user}
