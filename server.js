const express = require('express')
const bodyParser = require('body-parser')
const app = express()
global.config = require('./config/config')
const db = require('./config/db')
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('hola!')
})

// Load routes
require('./routes')(app)

const port = process.env.PORT || global.config.server.port

app.listen(3000, () => {
  console.log(`http://${global.config.server.host}:${port}`);
})
