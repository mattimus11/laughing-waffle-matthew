require('dotenv').config();
const { configDotenv } = require('dotenv');
const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.mongo_uri;
app.set('view engine','ejs')
app.use(express.static('./public/'))



console.log("whats up")

//app.get('/', function (req, res) {
  //res.sendFile('/index.html')
//})


//MONGODB CODE BELOW

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
     //Connect the client to the server	(optional starting in v4.7)
    await client.connect();
     //Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
     //Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

app.get('/mongo',async(req,res)=>{

  console.log('in mongo');
  await client.connect();
  console.log("connected");
  let result = await client.db("matts-db").collection("cool-collection").find({}).toArray();
  console.log(result);
})


app.get('/ejs',(res,req)=>{

  res.render('mongo', {
    mongoResults :  'mongo result'
  });

})

app.listen(3000)