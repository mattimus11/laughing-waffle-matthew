const express = require('express')
const app = express()

console.log("whats up")

app.get('/', function (req, res) {
  res.sendFile("/Users/matthew/Desktop/laughing-waffle-matthew/index.html")
})

app.listen(5500)