const express = require('express')
const app = express()
app.set('view engine','ejs')
app.use(express.static('./public/'))

console.log("whats up")

app.get('/', function (req, res) {
  res.sendFile('/index.html')
})


app.get('/ejs',(res,req)=>{

  res.render('index', {
    myServerVariable :  'my server variable'
  });

})

app.listen(5500)