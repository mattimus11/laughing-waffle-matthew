const express = require('express')
const app = express()

app.use(express.static('./public/'))

console.log("whats up")

app.get('/', function (req, res) {
  res.sendFile('/index.html')
})

app.listen(5500)