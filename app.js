const express = require('express')
const app = express()

console.log("whats up")

app.get('/', function (req, res) {
  res.sendFile("index.html")
})

app.listen(5500)