require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { urlencoded } = require('body-parser')
const { ObjectId } = require('mongodb')
const path = require('path')
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://Matthew:${process.env.mongo_pwd}@cluster0.vza6k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');


console.log(uri);

// MongoDB connection setup
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

app.get('/',async (req, res) => {
  await client.connect(); 
  const movies = await client.db("matts-db").collection("cool-collection")
      .find() 
      .sort({ rating: -1 }) 
      .limit(5) 
      .toArray(); 
  
  res.render('index', { movies });
});

app.get('/ratings', async (req, res) => {
  await client.connect()
  let result = await client.db("matts-db").collection("cool-collection")
    .find({}).toArray();

  console.log(result);

  res.render('ratings', {
    mongoResult: result
  });
});

app.post('/add-rating', async (req, res) => {
  const { movieName, rating } = req.body;

  // Number not a string doofus
  const numericRating = parseFloat(rating);

  if (isNaN(numericRating) || numericRating < 1 || numericRating > 10) {
      return res.status(400).send('Rating must be a number between 1 and 10.');
  }

  await client.db("matts-db").collection("cool-collection").insertOne({
      post: movieName,
      rating: numericRating // Save as a number
  });

  res.redirect('/ratings');
});


app.get("/insert",(req,res)=>{
  res.render("insert")
});

app.post('/insert', async (req, res) => {
  console.log('in /insert');

  // Convert post to string, ensure rating is also a number if included
  const numericRating = parseFloat(req.body.rating); // Ensure rating is handled if present

  await client.connect();
  await client.db("matts-db").collection("cool-collection").insertOne({ 
      post: req.body.post,
      rating: numericRating // Save as a number if rating is included
  });
  res.redirect('/ratings');
});


app.post('/update/:id', async (req, res) => {
    const movieId = req.params.id;
    const newRating = parseInt(req.body.newRating, 10);

        await client.connect();
        await client.db("matts-db").collection("cool-collection").updateOne(
            { _id: new ObjectId(movieId) },
            { $set: { rating: newRating } }
        );

        res.redirect('/ratings');
      }); 

app.post('/delete/:id', async (req,res)=>{

  console.log("req.parms.id: ", req.params.id)

  client.connect; 
  const collection = client.db("matts-db").collection("cool-collection");
  let result = await collection.findOneAndDelete( 
  {"_id": new ObjectId(req.params.id)})

.then(result => {
  console.log(result); 
  res.redirect('/ratings');
})




});

app.listen(5500);