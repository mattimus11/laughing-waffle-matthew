require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { ObjectId } = require('mongodb')
const path = require('path')
const { MongoClient, ServerApiVersion } = require('mongodb');
const PORT = process.env.PORT || 3000;
const uri = `mongodb+srv://Matthew:${process.env.mongo_pwd}@cluster0.vza6k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

let client;

async function connectToDatabase() {
  if (!client) {  // Only connect if client is undefined
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });

    try {
      await client.connect();
      console.log('Connected to MongoDB');
    } catch (err) {
      console.error('Failed to connect to MongoDB:', err);
      throw err;
    }
  }
}

async function getCollection() {
  await connectToDatabase();  // Ensure the database is connected
  return client.db("matts-db").collection("cool-collection");
}

app.get('/', async (req, res) => {
  try {
    const collection = await getCollection();
    const movies = await collection.find().sort({ rating: -1 }).limit(5).toArray(); // Ensure sorting works properly
    res.render('index', { movies });
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/ratings', async (req, res) => {
  try {
    const collection = await getCollection();
    const result = await collection.find().toArray();
    res.render('ratings', { mongoResult: result });
  } catch (err) {
    console.error('Error fetching ratings:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/add-rating', async (req, res) => {
  const { movieName, rating } = req.body;
  const numericRating = parseFloat(rating); // Convert to number

  if (isNaN(numericRating) || numericRating < 1 || numericRating > 10) {
    return res.status(400).send('Rating must be a number between 1 and 10.');
  }

  try {
    const collection = await getCollection();
    await collection.insertOne({
      post: movieName,
      rating: numericRating
    });
    res.redirect('/ratings');
  } catch (err) {
    console.error('Error adding rating:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get("/insert", (req, res) => {
  res.render("insert");
});

app.post('/insert', async (req, res) => {
  const numericRating = parseFloat(req.body.rating); // Handle rating if present

  try {
    const collection = await getCollection();
    await collection.insertOne({
      post: req.body.post,
      rating: numericRating // Ensure rating is saved as a number
    });
    res.redirect('/ratings');
  } catch (err) {
    console.error('Error inserting movie:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/update/:id', async (req, res) => {
  const movieId = req.params.id;
  const newRating = parseFloat(req.body.newRating); // Convert to number

  try {
    const collection = await getCollection();
    await collection.updateOne(
      { _id: new ObjectId(movieId) },
      { $set: { rating: newRating } }
    );
    res.redirect('/ratings');
  } catch (err) {
    console.error('Error updating rating:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/delete/:id', async (req, res) => {
  try {
    const collection = await getCollection();
    await collection.findOneAndDelete({ _id: new ObjectId(req.params.id) });
    res.redirect('/ratings');
  } catch (err) {
    console.error('Error deleting movie:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running & listening on port ${PORT}`);
});
