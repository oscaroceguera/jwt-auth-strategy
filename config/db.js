const mongoose = require('mongoose')

mongoose.connect(global.config.database)

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => console.log("Conection with database succeeded."))

exports.db = db
