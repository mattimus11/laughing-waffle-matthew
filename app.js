const express = require('express')
const app = express()

console.log("whats up")

app.get('/', function (req, res) {
  res.send("Hello from node")
})

app.listen(5500)