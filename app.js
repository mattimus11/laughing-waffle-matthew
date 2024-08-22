const express = require('express')
const app = express()

console.log("whats up")

app.get('/', function (req, res) {
  res.send('Hello Node from Express')
})

app.listen(5000)