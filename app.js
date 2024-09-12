require('dotenv').config();
const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.mongo_uri;

app.set('view engine', 'ejs');
app.use(express.static('./public/'));

console.log(uri);

// MongoDB connection setup
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToMongoDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
  }
}


connectToMongoDB().catch(console.dir);

app.get('/', (req, res) => {
  res.render('index', {
    myServerVariable: "Welcome to the homepage"
  });
});

app.get('/read', async (req, res) => {
    await client.connect()
    let result = await client.db("matts-db").collection("cool-collection")
      .find({}).toArray();

    console.log(result);

    res.render('mongo', {
      mongoResult: result
    });
});

app.get('/insert',async(req,res)=>{

  res.render('insert')

  await client.connect()
    let result = await client.db("matts-db").collection("cool-collection")
      .insertOne({post:'harcoded'});
    let result1 = await client.db("matts-db").collection("cool-collection")
      .insertOne({post:'harcoded too'});

    console.log(result);
})

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
